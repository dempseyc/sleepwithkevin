import './style.scss';
import $ from 'jquery';
import { fadeIn } from './anim.js';
import { DateTime } from 'luxon';
const linkify = require('linkifyjs');

const $tagLine = $('.tag-line').eq(0);
fadeIn($tagLine);

let request = $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/cal?calid=hhc1mfvhcajj77n5jcte1gq50s",
    dataType: 'jsonp',
    success: function (data) {
        let CAL = JSON.parse(data);
        handleData(CAL);
    },
    error: function( jqXHR, textStatus, errorThrown ) {
        console.log(errorThrown);
    }
});

let eventTemplate = (occ) => {
    let openComment = "<!--";
    let closeComment = "-->";
    let barSpan = "<span>|</span>";
    let uriTZID = encodeURIComponent(occ.timeZone);
    let uriNameStr = encodeURIComponent(occ.nameString);
    let uriAddressStr = encodeURIComponent(occ.addressString);
    let uriDetails = encodeURIComponent(occ.details);
    let uriMapLink = `https://maps.google.com/maps?hl=en&q=${uriAddressStr}&source=calendar`;

    // https://calendar.google.com/calendar/event?action=TEMPLATE&hl=en&text=Dope%20%28a%20free%20weekly%20comedy%20show%29&dates=20181222T210000%2F20181222T230000&location=Park%20View%20Bar%20%26%20Restaurant%2C%20219%20Dyckman%20St%2C%20New%20York%2C%20NY%2010034%20&ctz=America%2FNew_York&details=Like%3A%C2%A0www.bit.ly%2Fdopeshow%0AHashtag%3A%20%23DopeNY%0ATwitter%3A%20http%3A%2F%2Ftwitter.com%2Fberrey%0AInstagram%3A%20http%3A%2F%2Finstagram.com%2Fberrey%C2%A0
    let uriCalLink = `https://calendar.google.com/calendar/event?action=TEMPLATE&hl=en&text=${uriNameStr}&dates=${occ.timeCode}&location=${uriAddressStr}&ctz=${uriTZID}&details=${uriDetails}`;
    let htmlOpen = `<li class="calendar-item">
        <p class="date-time">${occ.dateString}</p>
        <p class="info">
            <span class="name">${occ.nameString}</span>`;
    console.log(occ.location, 'location');

    let htmlLocation = occ.location ? `   ${barSpan}
            <a class="location" href="${uriMapLink}" target="_blank">
                <span>${occ.addressString}</span>
                <span class="icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-map-marker-alt"></i></span>
            </a>` : '';

    let htmlLink = occ.link ? `        ${barSpan}
            <a class="link" href="${occ.link}" target="_blank">
                <span> link </span>
                <span class="icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-link"></i> </span>
            </a>` : '';

    let htmlClose = `        ${barSpan}
            <a href="${uriCalLink}" target="_blank">
                <span class="calendar-link icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-calendar-alt"></i></span>
            </a>

        </p>
    </li>`;
    let html = `${htmlOpen} ${htmlLocation} ${htmlLink} ${htmlClose}`;
    return html;
}

function createDateStr(occurence) {
    // 2019-01-15T17:00:00.000Z occurrence eg

    let months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    let hours = ['1','2','3','4','5','6','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10','11','12'];
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let parseDate = (occurence) => {
        let y = occurence.substr(0,4);
        let m = occurence.substr(5,2) - 1;
        let d = occurence.substr(8,2);
        let hr = occurence.substr(11,2);
        let min = occurence.substr(14,2);

        let D = new Date(y,m,d,hr,min);

        let dayStr = days[D.getDay()];
        let mStr = months[D.getMonth()];
        let dateStr = D.getDate();
        let hrStr = hours[D.getHours()-1];
        let ampm = D.getHours() < 12 ? 'am' : 'pm';
        let zero = D.getMinutes() < 10 ? "0" : "";
        let minStr = zero + String(D.getMinutes());
        let result = `${dayStr} ${mStr}/${dateStr} ${hrStr}:${minStr}${ampm}`;

        return result;

    } // end parseDate

    return parseDate(occurence);

} // end createDateString

// fine for now, might need another pass, thus the definition
let createAddressString = function (location) {
    return location;
}

// nailed it
let extrapolateOccasionsFromOccurrences = (vevents) => {
    let list = [];
    vevents.forEach( (event) => {
        event.occurrences.forEach( (occurence) => {
            let rawOccasion = {
                tzid: event.tzid,
                description: event.description,
                summary: event.summary,
                location: event.location,
                date: occurence
            };
            list.push(rawOccasion);
        });
    });
    return list;
};

function parseISOString (s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function sortOccasions (occasions) {
    return occasions.sort( (a,b) =>  {
        let p = parseISOString(a.date);
        let n = parseISOString(b.date);
        return n - p ;
    });
}

// cross fingers
// should return first url in description
function findLink (description) {
    let desc = description.replace(/(\\r\\n|\\n|\\r)/gm," ");
    let links = linkify.find(desc);
    let hrefs = [];
    links.forEach( (link) => {
        for (let key in link) {
            if (link[key] = 'url' ) {
                hrefs.push(link.href);
            }
        }
    });
    return hrefs.length ? hrefs[0] : false;
}

// cal link not in template
function createTimeCode ( date, tzid, duration ) {
    console.log('date', date);
    let YYYY = date.substr(0,4);
    let MM = date.substr(5,2) - 1;
    let DD = date.substr(8,2);
    let hh = date.substr(11,2);
    let mm = date.substr(14,2);
    let ss = '00';
    // output: "20181219T183000%2F20181219T193000"
    // date is a string in locale of tzid from LDT
    // duration is a number in milliseconds

    // cross fingers
    let LDTstart = DateTime.fromISO(date, {zone: tzid});
    let LDTend = LDTstart.plus({milliseconds: duration});
    // need this for start and end
    let toYYYYMMDDThhmmss = function (LDTdate) {
        //
        let result = `${YYYY}${MM}${DD}T${hh}${mm}${ss}`
        return String(result);
    }

    let start = toYYYYMMDDThhmmss(LDTstart);
    let end = toYYYYMMDDThhmmss(LDTend);
    let outputStr = `${start}%2F${end}`;
    return outputStr;
}

function handleData (CAL) {
    let vevents = CAL.calData.vcalendar[0].vevent;
    let occasions = sortOccasions(extrapolateOccasionsFromOccurrences(vevents));
    let FEoccasions = occasions.map( (occ) => {
        let occFE = {
            dateString: createDateStr(occ.date), // fn taking occ.date
            nameString: occ.summary,
            addressString: createAddressString(occ.location), // fn taking occ.location
            link: findLink(occ.description), // fn taking occ.description
            timeZone: occ.tzid,
            timeCode: createTimeCode(occ.date, occ.tzid, occ.duration), // fn taking occ.date applying occ.duration
            details: '' // fn taking occ details.. do they exist?  maybe trying to generate ticket link or other links
        };
        return Object.assign(occ, occFE);
    })
    
    // add in an enddate for timecode for duration for gcal link

    FEoccasions.forEach((occ) => {
    let $calendarItems = $('.calendar-items')[0];
        let $result = eventTemplate(occ);
        let $item = $.parseHTML($result);
        $calendarItems.append(($item)[0]);
    });
}

//    CAL
// {
//   "id": "hhc1mfvhcajj77n5jcte1gq50s",
//   "status": 200,
//   "message": "OK",
//   "calData": {
//     "calData": {
//       "vcalendar": [
//         {
//           "calName": "craig public test",
//           "timeZone": "America/New_York",
//           "vevent": [
//             {
//               "dtstart": "20181023T170000",
//               "tzid": "Europe/Paris",
//               "uid": "01nkipt4026cdqu4uvijjhr1me@google.com",
//               "description": "",
//               "summary": "weeklyeventTUE",
//               "location": "Paris, France 123 bouche",
//               "occurrences": [
//                 "2018-12-25T17:00:00.000Z",
//                 "2019-01-01T17:00:00.000Z",
//                 "2019-01-08T17:00:00.000Z",
//                 "2019-01-15T17:00:00.000Z",
//                 "2019-01-22T17:00:00.000Z",
//                 "2019-01-29T17:00:00.000Z",
//                 "2019-02-05T17:00:00.000Z",
//                 "2019-02-12T17:00:00.000Z",
//                 "2019-02-19T17:00:00.000Z",
//                 "2019-02-26T17:00:00.000Z",
//                 "2019-03-05T17:00:00.000Z",
//                 "2019-03-12T17:00:00.000Z",
//                 "2019-03-19T17:00:00.000Z",
//                 "2019-03-26T17:00:00.000Z",
//                 "2019-04-02T17:00:00.000Z",
//                 "2019-04-09T17:00:00.000Z",
//                 "2019-04-16T17:00:00.000Z"
//               ]
//             },
//             {
//               "dtstart": "20160604T210000",
//               "tzid": "America/New_York",
//               "uid": "0oko40419m2uk56fo3j4l6ujvi@google.com",
//               "description": "Like: www.bit.ly/dopeshow\\nHashtag: #DopeNY\\nTwitter: http://twitter.com/berrey\\nInstagram: http://instagram.com/berrey ",
//               "summary": "Dope (a free weekly comedy show)",
//               "occurrences": [
//                 "2018-12-22T21:00:00.000Z",
//                 "2018-12-29T21:00:00.000Z",
//                 "2019-01-05T21:00:00.000Z",
//                 "2019-01-12T21:00:00.000Z",
//                 "2019-01-19T21:00:00.000Z",
//                 "2019-01-26T21:00:00.000Z",
//                 "2019-02-02T21:00:00.000Z",
//                 "2019-02-09T21:00:00.000Z",
//                 "2019-02-16T21:00:00.000Z",
//                 "2019-02-23T21:00:00.000Z",
//                 "2019-03-02T21:00:00.000Z",
//                 "2019-03-09T21:00:00.000Z",
//                 "2019-03-16T21:00:00.000Z",
//                 "2019-03-23T21:00:00.000Z",
//                 "2019-03-30T21:00:00.000Z",
//                 "2019-04-06T21:00:00.000Z",
//                 "2019-04-13T21:00:00.000Z"
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   }
// }