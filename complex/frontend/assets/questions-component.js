(function (global) {
  'use strict'

  var React = global.React
  var ReactDOM = global.ReactDOM
  var ReactDOMServer = undefined // only required on the server
  var isBrowser = typeof module === 'undefined'

  if (!isBrowser) {
    React = require('react')
    ReactDOM = require('react-dom')
    ReactDOMServer = require('react-dom/server')
  }

  var e = React.createElement

  var questionsComponent = function (questions) {
    return e('table', {className: 'govuk-table'}, [
      e('thead', {key: 'head', className: 'govuk-table__head'}, 
        e('tr', {className: 'govuk-table__row'}, [
          e('th', {key: 'name', className: 'govuk-table__header', scope: 'col'}, 'Name'),
          e('th', {key: 'question', className: 'govuk-table__header', scope: 'col'}, 'Question'),
        ])
      ),
      e('tbody', {key: 'body', className: 'govuk-table__body' },
        (questions || []).map(function (question) {
          return e('tr', {key: question.id, className: 'govuk-table__row'}, [
            e('td', {key: 'name', className: 'govuk-table__cell'}, question.name),
            e('td', {key: 'question', className: 'govuk-table__cell'}, question.question),
          ])
        })
      )
    ])
  }

  if (isBrowser) {
    var component = questionsComponent(__INITIAL_STATE__)
    var container = document.getElementById('questions-component-container')
    ReactDOM.hydrate(component, container)
    if (typeof EventSource !== 'undefined') {
      var eventSource = new EventSource('/question-stream')
      eventSource.addEventListener('message', function (event) {
        var questions = JSON.parse(event.data)
        var component = questionsComponent(questions)
        ReactDOM.render(component, container)
      })
    }
  } else {
    module.exports.render = function (model) {
      var component = questionsComponent(model.questions)
      return ReactDOMServer.renderToString(component)
    }
  }
}(this))