workflow "Publish on release" {
  resolves = ["Publish to npm registry"]
  on = "release"
}

action "npm ci" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "run ci"
}

action "Only on master" {
  uses = "actions/bin/filter@ec328c7554cbb19d9277fc671cf01ec7c661cd9a"
  needs = ["npm ci"]
  args = "branch master"
}

action "Publish to npm registry" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["Only on master"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

workflow "Test on push" {
  resolves = ["npm ci"]
  on = "push"
}
