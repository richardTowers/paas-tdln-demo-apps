package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type questionRow struct {
	Id       int64  `json:"id"`
	Question string `json:"question"`
	Name     string `json:"name"`
}

type server struct {
	databaseConnectionString string
}

func (s *server) handler(w http.ResponseWriter, r *http.Request) {
	resultRows := []questionRow{}
	db, err := sql.Open("postgres", s.databaseConnectionString)
	if err != nil {
		handleError(w, "couldn't connect to database", err)
		return
	}
	defer db.Close()

	rows, err := db.Query("select id, name, question from questions")
	if err != nil {
		handleError(w, "couldn't read from database", err)
		return
	}
	for rows.Next() {
		var row questionRow
		err := rows.Scan(&row.Id, &row.Name, &row.Question)
		if err != nil {
			handleError(w, "couldn't read database row into object", err)
			return
		} else {
			resultRows = append(resultRows, row)
		}
	}
	result, err := json.Marshal(resultRows)
	if err != nil {
		handleError(w, "couldn't generate JSON from database resultRows", err)
		return
	}
	w.Write(result)
}

func handleError(w http.ResponseWriter, message string, err error) {
	log.Println(fmt.Errorf("%s: %v", message, err))
	w.WriteHeader(500)
	w.Write([]byte(fmt.Sprintf("{\"error\":\"%s\"}", message)))
}

func main() {
	databaseConnectionString, ok := os.LookupEnv("DB_CONNECTION_STRING")
	if !ok {
		log.Fatal("DB_CONNECTION_STRING must be set")
	}
	s := server{
		databaseConnectionString: databaseConnectionString,
	}
	http.HandleFunc("/", s.handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
