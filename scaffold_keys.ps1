$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 40 | % {[char]$_})
$header = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('{"alg":"HS256","typ":"JWT"}')).TrimEnd('=').Replace('+','-').Replace('/','_')
$iat = [int][double]::Parse((Get-Date -UFormat %s))
$exp = $iat + (10 * 365 * 24 * 60 * 60)

function Sign-JWT {
    param($payload)
    $encodedPayload = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($payload)).TrimEnd('=').Replace('+','-').Replace('/','_')
    $toSign = "$header.$encodedPayload"
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
    $signature = [Convert]::ToBase64String($hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($toSign))).TrimEnd('=').Replace('+','-').Replace('/','_')
    return "$toSign.$signature"
}

$anonPayload = '{"role":"anon","iss":"supabase","iat":'+$iat+',"exp":'+$exp+'}'
$servicePayload = '{"role":"service_role","iss":"supabase","iat":'+$iat+',"exp":'+$exp+'}'

$anonKey = Sign-JWT -payload $anonPayload
$serviceKey = Sign-JWT -payload $servicePayload

Write-Host "JWT_SECRET=$secret"
Write-Host "ANON_KEY=$anonKey"
Write-Host "SERVICE_KEY=$serviceKey"
