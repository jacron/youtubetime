// function getClipboardData() {
//     console.log('get clipb data...');
//     navigator.clipboard.read().then(items => {
//         console.log(items);
//     })
// }
//
// chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
//     if (req.request) {
//         switch(req.request) {
//             case 'getClipboardData':
//                 sendResponse({data: getClipboardData()})
//                 break;
//             default:
//                 sendResponse('invalid request:' + req.request);
//                 break;
//         }
//     } else {
//         sendResponse('no request received');
//     }
// });
