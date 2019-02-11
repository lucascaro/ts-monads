workflow "Test on push for continuous integration" {
  resolves = ["npm run ci"]
  on = "push"
}

action "npm run ci" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "run ci"
}