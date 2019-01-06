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

type QuestionListGetter = func(w http.ResponseWriter) []QuestionRow

type QuestionRow struct {
	Id       int64  `json:"id"`
	Question string `json:"question"`
	Name     string `json:"name"`
}

type Server struct {
	MakeQuestionsListQuery QuestionListGetter
}

func (s *Server) QuestionListHandler(w http.ResponseWriter, r *http.Request) {
	resultRows := s.MakeQuestionsListQuery(w)
	result, err := json.Marshal(resultRows)
	if err != nil {
		handleError(w, "couldn't generate JSON from database resultRows", err)
		return
	}
	w.Write(result)
}

func makeQuestionsListQuery(databaseConnectionString string) QuestionListGetter {
	return func(w http.ResponseWriter) []QuestionRow {
		db, err := sql.Open("postgres", databaseConnectionString)
		if err != nil {
			handleError(w, "couldn't connect to database", err)
			return nil
		}
		defer db.Close()

		resultRows := []QuestionRow{}
		rows, err := db.Query("select id, name, question from questions")
		if err != nil {
			handleError(w, "couldn't read from database", err)
			return nil
		}
		for rows.Next() {
			var row QuestionRow
			err := rows.Scan(&row.Id, &row.Name, &row.Question)
			if err != nil {
				handleError(w, "couldn't read database row into object", err)
				return nil
			} else {
				resultRows = append(resultRows, row)
			}
		}
		return resultRows
	}
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
	s := Server{
		MakeQuestionsListQuery: makeQuestionsListQuery(databaseConnectionString),
	}
	http.HandleFunc("/", s.QuestionListHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
