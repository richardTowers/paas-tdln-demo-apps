#!/usr/bin/env bash

set -e -u -o pipefail

cf "$(dirname "$0")"

# -------------------
# Create the database
# -------------------

db_name=tdln-db
if ! cf service "$db_name" > /dev/null; then
  cf create-service postgres tiny-unencrypted-9.5 "$db_name"

  status=$(cf service "$db_name" | grep 'status:')
  while ! grep "create succeeded" <<< "$status"; do
    echo "$db_name: $status"
    sleep 2
    status=$(cf service "$db_name" | grep 'status:')
  done
fi

# ------------------
# Run the migrations
# ------------------

echo "Running DB migrations"
cat db-migrations/* | cf conduit "$db_name" -- psql

# ------------------------------------
# Push the apps (but don't start them)
# ------------------------------------

cf push --no-start

# --------------------------------------
# Set the DB connection string variables
# --------------------------------------

question_list_db_url=$(
  cf curl "/v2/apps/$(cf app --guid tdln-question-list)/env" |
    jq -r '.system_env_json.VCAP_SERVICES.postgres[].credentials.uri'
)
question_submit_db_url=$(
  cf curl "/v2/apps/$(cf app --guid tdln-question-submit)/env" |
    jq -r '.system_env_json.VCAP_SERVICES.postgres[].credentials.uri'
)

cf set-env tdln-question-list DB_CONNECTION_STRING "$question_list_db_url"
cf set-env tdln-question-submit DB_CONNECTION_STRING "$question_submit_db_url"

# ------------------------
# Add the network policies
# ------------------------

cf add-network-policy tdln-frontend --destination-app tdln-question-list
cf add-network-policy tdln-frontend --destination-app tdln-question-submit
cf add-network-policy tdln-frontend --destination-app tdln-qr-code

# --------------
# Start the apps
# --------------

cf start tdln-question-list
cf start tdln-qr-code
cf start tdln-frontend


# ----------------
# Announce success
# ----------------

echo "All done! Your app should be live at https://tdln.london.cloudapps.digital"

