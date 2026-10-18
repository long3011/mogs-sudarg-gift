param(
  [string]$CommitMessage = "Deploy website $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

Write-Host 'Building the website...'
npm run build
if ($LASTEXITCODE -ne 0) {
  throw 'The production build failed.'
}

Write-Host 'Staging project changes...'
git add -A -- . ':(exclude)node_modules'

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host 'No changes to commit. Deploying the current dist folder.'
} else {
  git commit -m $CommitMessage
  if ($LASTEXITCODE -ne 0) {
    throw 'The commit failed.'
  }
}

Write-Host 'Pushing main branch...'
git push origin main
if ($LASTEXITCODE -ne 0) {
  throw 'Pushing the main branch failed.'
}

Write-Host 'Deploying dist to GitHub Pages...'
git subtree push --prefix dist origin gh-pages
if ($LASTEXITCODE -ne 0) {
  throw 'Deploying the gh-pages branch failed.'
}

Write-Host ''
Write-Host 'Deployment complete:'
Write-Host 'https://long3011.github.io/mogs-sudarg-gift/'
