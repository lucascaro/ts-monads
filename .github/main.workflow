workflow "Test/Build" {
  on = "push"
  resolves = ["npm ci"]
}

action "npm ci" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "run ci"
}
