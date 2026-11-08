$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4173
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()
Write-Host "COME serving on http://localhost:$port"

function Get-Mime([string]$path) {
  switch ([System.IO.Path]::GetExtension($path).ToLower()) {
    ".html" { "text/html; charset=utf-8" }
    ".css"  { "text/css; charset=utf-8" }
    ".js"   { "text/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".svg"  { "image/svg+xml" }
    ".png"  { "image/png" }
    ".jpg"  { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".webp" { "image/webp" }
    ".woff2" { "font/woff2" }
    default { "application/octet-stream" }
  }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $stream.ReadTimeout = 1200
    $stream.WriteTimeout = 5000
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) { $client.Close(); continue }
    while (($line = $reader.ReadLine()) -ne $null -and $line -ne "") { }
    $parts = $requestLine.Split(" ")
    $method = $parts[0]
    $rawPath = $parts[1]
    $pathOnly = $rawPath.Split("?")[0].TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($pathOnly)) { $pathOnly = "index.html" }
    $pathOnly = [System.Uri]::UnescapeDataString($pathOnly)
    $file = [System.IO.Path]::GetFullPath((Join-Path $root $pathOnly))
    if (-not $file.StartsWith($root)) { throw "forbidden" }
    if ($method -eq "HEAD") {
      $status = if (Test-Path $file -PathType Leaf) { "200 OK" } else { "404 Not Found" }
      $headers = "HTTP/1.1 $status`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
      $bytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($bytes, 0, $bytes.Length)
    } elseif (Test-Path $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $mime = Get-Mime $file
      $headers = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $hbytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($hbytes, 0, $hbytes.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $headers = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $hbytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($hbytes, 0, $hbytes.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    }
    $stream.Flush()
  } catch {
    try {
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Error")
      $h = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 500 Internal Server Error`r`nContent-Length: $($msg.Length)`r`nConnection: close`r`n`r`n")
      $client.GetStream().Write($h, 0, $h.Length)
      $client.GetStream().Write($msg, 0, $msg.Length)
    } catch { }
  } finally {
    $client.Close()
  }
}
