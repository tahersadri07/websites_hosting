$files = @(
  "app\admin\page.tsx",
  "app\admin\layout.tsx",
  "app\admin\services\page.tsx",
  "app\admin\services\actions.ts",
  "app\admin\gallery\page.tsx",
  "app\admin\gallery\actions.ts",
  "app\admin\testimonials\page.tsx",
  "app\admin\testimonials\actions.ts",
  "app\admin\inquiries\page.tsx"
)

$importLine = "import { getAdminBusinessSlug } from `"@/lib/admin-context`";"
$oldSlug    = 'const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";'
$newSlug    = 'const slug = await getAdminBusinessSlug();'

foreach ($file in $files) {
  $path = Join-Path "e:\project\phase_1_website" $file
  $content = Get-Content $path -Raw -Encoding UTF8

  # Add import only if not already present
  if ($content -notmatch "getAdminBusinessSlug") {
    # Insert after the first import block
    $content = $content -replace '(import \{ getAdminBusinessSlug \} from "@/lib/admin-context";|(?m)^import .+ from ".+";(?=\r?\nimport|\r?\n\r?\n))', '$1'
    # Prepend import at the top (after "use server" directive if present)
    if ($content -match '"use server"') {
      $content = $content -replace '("use server";\r?\n)', ("`$1" + $importLine + "`n")
    } else {
      $content = $importLine + "`n" + $content
    }
  }

  # Replace the slug assignment
  $content = $content.Replace($oldSlug, $newSlug)

  Set-Content $path $content -Encoding UTF8 -NoNewline
  Write-Host "Updated: $file"
}

Write-Host "Done - all 9 files updated."
