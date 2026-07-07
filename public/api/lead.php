<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
  exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');
$formName = trim($_POST['form_name'] ?? 'Заявка с сайта');

$pageUrl = trim($_POST['page_url'] ?? '');
$referrer = trim($_POST['referrer'] ?? '');
$utmSource = trim($_POST['utm_source'] ?? '');
$utmMedium = trim($_POST['utm_medium'] ?? '');
$utmCampaign = trim($_POST['utm_campaign'] ?? '');
$utmTerm = trim($_POST['utm_term'] ?? '');
$utmContent = trim($_POST['utm_content'] ?? '');

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Заполните имя и телефон']);
  exit;
}

/**
 * 1) Отправка на почту
 */
$to = 'morifass@mail.ru';
$subject = 'Новая заявка с сайта Кухни Оренбург';

$body = "Новая заявка с сайта:\n\n";
$body .= "Форма: {$formName}\n";
$body .= "Имя: {$name}\n";
$body .= "Телефон: {$phone}\n";
$body .= "Сообщение: {$message}\n";
$body .= "Страница: {$pageUrl}\n";
$body .= "Реферер: {$referrer}\n";
$body .= "UTM Source: {$utmSource}\n";
$body .= "UTM Medium: {$utmMedium}\n";
$body .= "UTM Campaign: {$utmCampaign}\n";
$body .= "UTM Term: {$utmTerm}\n";
$body .= "UTM Content: {$utmContent}\n";
$body .= "Дата: " . date('d.m.Y H:i:s') . "\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'неизвестно') . "\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
$headers[] = 'From: morifass@mail.ru';
$headers[] = 'Reply-To: morifass@mail.ru';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$mailSuccess = mail($to, $subject, $body, implode("\r\n", $headers));

// /**
//  * 2) Создание лида в Bitrix24 (закомментировано)
//  * Вебхук: https://b24-8dw5dg.bitrix24.ru/rest/1/p4d8yhnhm270smnw/
//  */
// $bitrixWebhook = 'https://b24-8dw5dg.bitrix24.ru/rest/1/p4d8yhnhm270smnw/';

// $comment = "Форма: {$formName}\n";
// $comment .= "Сообщение: {$message}\n";
// $comment .= "Страница: {$pageUrl}\n";
// $comment .= "Реферер: {$referrer}\n";
// $comment .= "UTM Source: {$utmSource}\n";
// $comment .= "UTM Medium: {$utmMedium}\n";
// $comment .= "UTM Campaign: {$utmCampaign}\n";
// $comment .= "UTM Term: {$utmTerm}\n";
// $comment .= "UTM Content: {$utmContent}";

// $bitrixData = [
//   'fields' => [
//     'TITLE' => "Заявка с сайта: {$name}",
//     'NAME' => $name,
//     'PHONE' => [
//       ['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']
//     ],
//     'COMMENTS' => $comment,
//     'SOURCE_ID' => 'WEB',
//     'SOURCE_DESCRIPTION' => $formName,
//     'UTM_SOURCE' => $utmSource,
//     'UTM_MEDIUM' => $utmMedium,
//     'UTM_CAMPAIGN' => $utmCampaign,
//     'UTM_CONTENT' => $utmContent,
//     'UTM_TERM' => $utmTerm,
//   ],
//   'params' => ['REGISTER_SONET_EVENT' => 'Y'],
// ];

// $ch = curl_init($bitrixWebhook . 'crm.lead.add.json');
// curl_setopt_array($ch, [
//   CURLOPT_RETURNTRANSFER => true,
//   CURLOPT_POST => true,
//   CURLOPT_POSTFIELDS => http_build_query($bitrixData),
//   CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
// ]);

// $bitrixResponse = curl_exec($ch);
// $bitrixError = curl_error($ch);
// curl_close($ch);

// $bitrixSuccess = $bitrixResponse && !$bitrixError;

if ($mailSuccess) {
  echo json_encode([
    'success' => true,
    'message' => 'Заявка отправлена',
  ]);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Ошибка отправки заявки']);
}
