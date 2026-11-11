#!/usr/bin/env bash
# Pulls the repo list from GitHub (via the gh CLI, so private repos work too),
# merges data/extras.json on top and writes data/projects.json.
# Run it whenever you want the book to reflect the current state of your repos.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "gh CLI missing"; exit 1; }
command -v jq >/dev/null || { echo "jq missing"; exit 1; }

owner="$(gh api user --jq .login)"
avatar="$(gh api user --jq .avatar_url)"
name="$(gh api user --jq '.name // .login')"

repos="$(gh repo list "$owner" --limit 200 \
  --json name,description,primaryLanguage,pushedAt,createdAt,isPrivate,isFork,isArchived,url,stargazerCount,homepageUrl)"

# Commit count per repo (default branch) via the REST API, from the Link header of a 1-per-page listing.
counts="{}"
while read -r repo; do
  n="$(gh api -i "repos/$owner/$repo/commits?per_page=1" 2>/dev/null \
      | grep -i '^link:' | sed -n 's/.*page=\([0-9]*\)>; rel="last".*/\1/p')"
  [ -z "$n" ] && n=1
  counts="$(jq --arg r "$repo" --argjson n "$n" '. + {($r): $n}' <<<"$counts")"
done < <(jq -r '.[].name' <<<"$repos")

jq -n \
  --argjson repos "$repos" \
  --argjson extras "$(cat data/extras.json)" \
  --argjson counts "$counts" \
  --arg owner "$owner" --arg avatar "$avatar" --arg name "$name" \
  --arg generated "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
  {
    owner: $owner, name: $name, avatar: $avatar, generated: $generated,
    projects: [
      $repos[]
      | . as $r
      | ($extras[$r.name] // {}) as $x
      | select(($x.hidden // false) == false)
      | {
          id: $r.name,
          title: ($x.title // $r.name),
          description: ($x.blurb // $r.description // ""),
          tagline: ($x.tagline // ""),
          sfx: ($x.sfx // "POW!"),
          scene: ($x.scene // (if ($r.primaryLanguage.name // "") == "GDScript" then "game"
                               elif ($r.primaryLanguage.name // "") == "Dart" then "app"
                               else "code" end)),
          image: ($x.image // null),
          tags: ($x.tags // []),
          language: ($r.primaryLanguage.name // "—"),
          url: $r.url,
          homepage: ($x.homepage // $r.homepageUrl // ""),
          homepageLabel: ($x.homepageLabel // "Play / Visit"),
          private: $r.isPrivate,
          archived: $r.isArchived,
          stars: $r.stargazerCount,
          commits: ($counts[$r.name] // 0),
          createdAt: $r.createdAt,
          pushedAt: $r.pushedAt
        }
    ] | sort_by(.pushedAt) | reverse
  }' > data/projects.json

echo "wrote data/projects.json with $(jq '.projects|length' data/projects.json) projects"
