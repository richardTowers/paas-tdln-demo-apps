package main_test

import (
	"net/http"
	"net/http/httptest"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	. "tdln-question-list"
)

var _ = Describe("question list handler", func() {

	It("lists questions", func() {

		req, err := http.NewRequest("GET", "/", nil)
		Expect(err).NotTo(HaveOccurred())

		s := Server{
			MakeQuestionsListQuery: func(w http.ResponseWriter) []QuestionRow { return []QuestionRow{} },
		}

		responseRecorder := httptest.NewRecorder()
		handler := http.HandlerFunc(s.QuestionListHandler)

		handler.ServeHTTP(responseRecorder, req)
		Expect(responseRecorder.Code).To(Equal(http.StatusOK))

	})

})
