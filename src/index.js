import './style.scss';
import $ from 'jquery';
import { fadeIn } from './anim.js';

const $tagLine = $('.tag-line').eq(0);
fadeIn($tagLine);

const $body = document.getElementsByTagName("body")[0];

$body.style.visibility="visible";

let eventTemplate = (dateString,nameString,addressString,timeZone,timeCode,details) => {
    let openComment = "<!--";
    let closeComment = "-->";
    let barSpan = "<span>|</span>";
    // let dateString = "Saturday 9/10 6:00pm";
    // let nameString = "The New York Comedy Night";
    // let addressString = "Café Oscar, Paris";
    let uriNameStr = encodeURIComponent(nameString);
    let uriAddressStr = encodeURIComponent(addressString);
    let uriDetails = encodeURIComponent(details);
    let mapLink = `https://maps.google.com/maps?hl=en&q=${uriAddressStr}&source=calendar`;
    let calLink = `https://calendar.google.com/calendar/event?action=TEMPLATE&hl=en&text=${uriNameStr}&dates=${timeCode}&location=${uriAddressStr}&ctz=${timeZone}&details=${uriDetails}`;
    let html = `<li class="calendar-item">
        <p class="date-time">${dateString}</p>
        <p class="info">
            <span class="name">${nameString}</span>
            ${barSpan}
            <a href="${mapLink}" target="_blank">
                <span class="location">${addressString}</span>
                <span class="icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-map-marker-alt"></i></span>
            </a>
            ${openComment}
            <a href="#" target="_blank">
                <span class="ticket-link"> | tickets |</span>
            </a>
            ${closeComment}
            ${openComment}
            ${barSpan}
            <a href="${calLink}" target="_blank">
                <span class="calendar-link icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-calendar-alt"></i></span>
            </a>
            ${closeComment}
        </p>
    </li>`;
    return html;
}

let VEVENT = [
    {
    "DTSTART": "20180912T010000Z",
    "DTEND": "20180912T020000Z",
    "DTSTAMP": "20180905T121512Z",
    "UID": "C641E4AA-E216-4C4D-B912-C2B8EA5E2A0B",
    "URL": "http://www.panameartcafe.com/reservation/?evenement=1189&date=17544",
    "CREATED": "20180825T020520Z",
    "DESCRIPTION": "",
    "LAST-MODIFIED": "20180905T043726Z",
    "LOCATION": "Paname Café\\, Paris",
    "SEQUENCE": "1",
    "STATUS": "CONFIRMED",
    "SUMMARY": "French Fried Comedy",
    "TRANSP": "OPAQUE",
    "VALARM": [
        {
        "ACTION": "NONE",
        "TRIGGER;VALUE=DATE-TIME": "19760401T005545Z"
        }
    ]
    },
    {
    "DTSTART": "20180902T010000Z",
    "DTEND": "20180902T020000Z",
    "DTSTAMP": "20180905T121512Z",
    "UID": "E0DD5C30-953A-42C8-AB89-91AA33D0CFE9",
    "CREATED": "20180901T181111Z",
    "DESCRIPTION": "",
    "LAST-MODIFIED": "20180901T181154Z",
    "LOCATION": "the PIT Chapel Hill\\, NC",
    "SEQUENCE": "0",
    "STATUS": "CONFIRMED",
    "SUMMARY": "Fresh Bits! Comedy",
    "TRANSP": "OPAQUE",
    "VALARM": [
        {
        "ACTION": "NONE",
        "TRIGGER;VALUE=DATE-TIME": "19760401T005545Z"
        }
    ]
    },
    {
    "DTSTART": "20180908T160000Z",
    "DTEND": "20180908T170000Z",
    "DTSTAMP": "20180905T121512Z",
    "UID": "29EB85EF-0695-44C0-B409-E4FFB7C383D2",
    "CREATED": "20180828T233555Z",
    "DESCRIPTION": "",
    "LAST-MODIFIED": "20180831T145037Z",
    "LOCATION": "36 rue Dalayrac\\, Paris",
    "SEQUENCE": "0",
    "STATUS": "CONFIRMED",
    "SUMMARY": "The Great British American Comedy Show",
    "TRANSP": "OPAQUE",
    "VALARM": [
        {
        "ACTION": "NONE",
        "TRIGGER;VALUE=DATE-TIME": "19760401T005545Z"
        }
    ]
    },
    {
    "DTSTART": "20180906T190000Z",
    "DTSTAMP": "20180905T121512Z",
    "UID": "F2DCD828-9305-4A9C-BC8F-22D184C9768E",
    "CREATED": "20180824T182021Z",
    "DESCRIPTION": "",
    "LAST-MODIFIED": "20180831T144518Z",
    "LOCATION": "Café Oscar\\, Paris",
    "SEQUENCE": "0",
    "STATUS": "CONFIRMED",
    "SUMMARY": "The New York Comedy Night",
    "TRANSP": "OPAQUE",
    "VALARM": [
        {
        "ACTION": "NONE",
        "TRIGGER;VALUE=DATE-TIME": "19760401T005545Z"
        }
    ]
    }
]; ///////////////////data from ical

function createDateStr(dateTime,timezone) {
    // let offset = timezone == 'Paris' ? -7 : -7;
    // 20180906T190000Z
    let months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    let hours = ['1','2','3','4','5','6','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10','11','12'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let parseDate = (str) => {
        let y = str.substr(0,4);
        let m = str.substr(4,2) - 1;
        let d = str.substr(6,2);
        let hr = str.substr(9,2);
        let min = str.substr(11,2);
        let D = new Date(Date.UTC(y,m,d,hr,min));
        let dayStr = days[D.getDay()];
        let mStr = months[D.getMonth()];
        let dateStr = D.getDate();
        let hrStr = hours[D.getHours()-1];
        let ampm = D.getHours() < 12 ? 'am' : 'pm';
        let zero = D.getMinutes() < 10 ? "0" : "";
        let minStr = zero + String(D.getMinutes());
        let result = `${dayStr} ${mStr}/${dateStr} ${hrStr}:${minStr}${ampm}`;
        return Object.assign({}, {
            date: D,
            dateStr: result
        });
        }
    return parseDate(dateTime);
}

let calEvtMap = VEVENT.map((item) => {
    let location = item.LOCATION.split('\\, ');
    let timezone = location[1];
    let date = createDateStr(item.DTSTART,timezone);
    return Object.assign({},{
        date: date.date,
        dateString: date.dateStr,
        nameString: item.SUMMARY,
        addressString: item.LOCATION.split('\\').join(' '),
        timeCode: item.DTSTART,
        timeZone: timezone
    });
});

calEvtMap.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return a.date - b.date;
});

console.log(calEvtMap);
// let calEvtMap = VEVENT.map((item) => {
//     console.log(item);
//     return item;
// })

let $calendarItems = $('.calendar-items')[0];

let calEvents = [
    {
        dateString: "Saturday 9/10 6:00pm",
        nameString: "The New York Comedy Night",
        addressString: "Café Oscar, Paris",
        timeZone: "France%2FParis",
        timeCode: "20180906T150000%2F20180906T150001",
        details: ""
    }
];

// calEvents.forEach((calEvt) => {
//     let $result = eventTemplate(calEvt.dateString,calEvt.nameString,calEvt.addressString,calEvt.timeZone,calEvt.timeCode,calEvt.details);
//     let $item = $.parseHTML($result);
//     $calendarItems.append(($item)[0]);
// })

calEvtMap.forEach((calEvt) => {
    let $result = eventTemplate(calEvt.dateString,calEvt.nameString,calEvt.addressString,calEvt.timeZone,calEvt.timeCode,calEvt.details);
    let $item = $.parseHTML($result);
    $calendarItems.append(($item)[0]);
})

