const component = require('./questions-component');

test('renders a table body without erroring', () => {
  const result = component.render({}, [])
  expect(result).toMatch(/^<tbody /)
});

test('renders some questions', () => {
  const result = component.render({ questions: [
    {name: 'Some Test Name 1', question: 'Some question 1?'},
    {name: 'Some Test Name 2', question: 'Some question 2?'},
  ]})

  expect(result).toMatch(/<td[^>]*>Some Test Name 1<\/td>/)
  expect(result).toMatch(/<td[^>]*>Some question 1\?<\/td>/)

  expect(result).toMatch(/<td[^>]*>Some Test Name 2<\/td>/)
  expect(result).toMatch(/<td[^>]*>Some question 2\?<\/td>/)
});