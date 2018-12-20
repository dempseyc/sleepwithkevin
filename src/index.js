import './style.scss';
import $ from 'jquery';
import { fadeIn } from './anim.js';
import DateTime from 'luxon';

const $tagLine = $('.tag-line').eq(0);
fadeIn($tagLine);

// let CAL;/

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

// create showtimes list from data
// sort list
// add fe strings to items
// create html from template
// append to page

let eventTemplate = (dateString,nameString,addressString,ticketLink,timeZone,details) => {
    let openComment = "<!--";
    let closeComment = "-->";
    let barSpan = "<span>|</span>";
    let timeCode = "20181219T183000%2F20181219T193000"; //eg
    // let dateString = "Saturday 9/10 6:00pm";
    // let nameString = "The New York Comedy Night";
    // let addressString = "Café Oscar, Paris";
    let uriNameStr = encodeURIComponent(nameString);
    let uriAddressStr = encodeURIComponent(addressString);
    let uriDetails = encodeURIComponent(details);
    let mapLink = `https://maps.google.com/maps?hl=en&q=${uriAddressStr}&source=calendar`;
    let calLink = `https://calendar.google.com/calendar/event?action=TEMPLATE&hl=en&text=${uriNameStr}&dates=${timeCode}&location=${uriAddressStr}&ctz=${ticketLink}&details=${uriDetails}`;
    let html = `<li class="calendar-item">
        <p class="date-time">${dateString}</p>
        <p class="info">
            <span class="name">${nameString}</span>
            ${barSpan}
            <a class="location" href="${mapLink}" target="_blank">
                <span>${addressString}</span>
                <span class="icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-map-marker-alt"></i></span>
            </a>
            </br>
            <a class="tickets" href="${ticketLink}" target="_blank">
                <span> tickets </span>
                <span class="icons"> <i class="fas fa-arrow-right"></i> <i class="fas fa-ticket-alt"></i> </span>
            </a>

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

function createDateStr(occurance) {
    // 2019-01-15T17:00:00.000Z

    let months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    let hours = ['1','2','3','4','5','6','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10','11','12'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let parseDate = (str) => {
        let y = str.substr(0,4);
        let m = str.substr(4,2) - 1;
        let d = str.substr(6,2);
        let hr = str.substr(9,2);
        let min = str.substr(11,2);

        let D = new Date(y,m,d,hr,min);
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

    } // end parseDate

    return parseDate(dateTime);

} // end createDateString

// nailed it
let extrapolateOccasionsFromOccurrences = (vevent) => {
    let list = [];
    vevent.forEach( (event) => {
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

let sortOccasions = (occasions) => {
    return occasions.sort( (a,b) =>  a.date - b.date );
};

function handleData (CAL) {
    let vevents = CAL.calData.vcalendar[0].vevent;
    let occasions = sortOccasions(extrapolateOccasionsFromOccurrences(vevents));
    console.log(occasions);
    let FEoccasions = occasions.map( (occ) => {
        let occFE = {
            dateString: '', // fn taking occ.date
            nameString: '',  // fn taking occ.summary
            addressString: '', // fn taking occ.location
            ticketLink: '', // fn taking occ.description
            timeZone: '', // fn taking occ.tzid
            timeCode: '', // fn taking occ.date applying occ.duration
            details: '' // fn taking occ details.. do they exist?  maybe trying to generate ticket link or other links
        };
        return Object.assign(occ, occFE);
    })
    
    // add in an enddate for timecode for duration for gcal link

    FEoccasions.forEach((occ) => {
    let $calendarItems = $('.calendar-items')[0];
        let $result = eventTemplate(occ.dateString,occ.nameString,occ.addressString,occ.ticketLink,occ.timeZone,occ.timeCode,occ.details);
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