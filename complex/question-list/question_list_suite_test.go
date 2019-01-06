package main_test

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestQuestionList(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "QuestionList Suite")
}
