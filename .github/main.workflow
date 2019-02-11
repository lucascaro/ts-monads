workflow "Publish on release" {
  resolves = ["Publish to npm registry"]
  on = "push"
}

workflow "Test on push for continuous integration" {
  resolves = ["npm run ci"]
  on = "push"
}

action "Publish to npm registry" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["npm run ci"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "npm run ci" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "ci"
}

