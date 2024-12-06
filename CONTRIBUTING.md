## Contributing Guide

### Branch naming

All issue/feature branches should bve created from the default branch, which is `development`.
Branches should be named in the following format:

`feature/REDMINE_ISSUE_ID-short-description` or
`issue/REDMINE_ISSUE_ID-short-description`

### Commit message

For this particular library we use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
Please follow its rules as it is required for publishing the library to Gitlab Package Registry.
We use Gitlab CI/CD pipelines with [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
for Semantic versioning.

Basic rules for commit message
* Commit message for fixing a bug or small change should look like this
  `fix: short description of what was fixed` (this will create a minor release (1.1.0 > 1.1.1) and publish new version to the registry).

* Commit message for the new feature should look like this
  `feat: short description of what was implemented` (this will create a minor release (1.1.0 > 1.2.0) and publish new version to the registry).

### Merge Request

Assign it to yourself while it is in progress. When it is ready for review, a reviewer should be assigned.

#### Title

`[#12313] Title of a redmine ticket`. Add `Draft:` if MR is not ready yet. E.g.: `Draft:[#12313] Title of a redmine ticket`.
#### Description

```
# Summary

<!-- Required section. Include a brief high level summary of this merge request: this is what needs to be done. -->

<!-- Required: link to the associated Redmine story, ect. -->
**Main Story:** [#XXX](https://redmine.gluzdov.com/issues/XXX)
```

