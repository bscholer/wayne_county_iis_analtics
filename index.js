var fs = require('fs');
var path = require("path");
var https = require('https');
var dayjs = require('dayjs');

// Change this line to where you want to read log files from.
const LOG_FILE_PATH = "C:\\Users\\bscholer\\Downloads\\W3SVC1\\W3SVC1";

// DON'T TOUCH THESE LINES UNLESS YOU KNOW WHAT YOU'RE DOING.
//join directory
const dirPath = path.join(LOG_FILE_PATH, "");
const DATE_REGEX = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;
const SECOND_IP_REGEX = /[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}.*?([\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3})/;
const OUTPUT_FILE_NAME = "analytics_report.csv";

let outputCSV = "UTCDatetime,ESTDatetime,UniqueUsers\n";

let ctr = 0;
let startTime = dayjs();

fs.readdir(dirPath, function (err, files) {
    if (err) {
        console.log(err);
        return console.log("Something went wrong.");
    }
    for (let logFile of files) {
        // File name doesn't match "u_ex000000.log", so skip it.
        if (!logFile.match(/[a-z]+[\d]{6}\.log/m)) continue;

        let filePath = LOG_FILE_PATH + "\\" + logFile;

        // Read the contents of the file
        fs.readFile(filePath, 'utf8', function (err, data) {
            ctr++;
            if (err) {
                console.log(err);
                return console.log("Couldn't read file: " + filePath);
            }

            let minutes = [
                // {
                //     "minute": "YYYY-MM-DD HH:mm:ss",
                //     "IPs": [
                //         "192.168.1.1",
                //         "192.168.1.2"
                //     ]
                // }
            ];

            let lines = data.split("\n");
            let relevantLines = [];

            // Get rid of any lines that aren't about WebLink
            for (let line of lines) {
                if (line.match(/\/WebLink[\d]?.+/i)) relevantLines.push(line);
            }
            for (let line of relevantLines) {
                let time = dayjs(line.match(DATE_REGEX)[0]);
                // Make sure the line has the applicable IPs.
                if (!line.match(SECOND_IP_REGEX)) continue;
                if (line.match(SECOND_IP_REGEX).length < 2) continue;
                let IPAddr = line.match(SECOND_IP_REGEX)[1];
                let min = time.format("YYYY-MM-DD HH:mm");

                // Add that minute to the list if it isn't in there already.
                let minuteInList = false;
                for (let minute of minutes) {
                    if (minute["minute"] === min) {
                        minuteInList = true;
                    }
                }
                // If the minute doesn't exist, add the minute and the IP.
                if (!minuteInList) {
                    let newMinuteObj = {
                        "minute": min,
                        "IPs": [
                            IPAddr
                        ]
                    };
                    minutes.push(newMinuteObj);
                }
                // Minute already exists, so just add the IP.
                else {
                    for (let minute of minutes) {
                        if (minute["minute"] === min) {
                            // Add all the IPs, filter later.
                            minute.IPs.push(IPAddr)
                        }
                    }
                }
            }
            // Get rid of duplicate IPs.
            for (let minute of minutes) {
                // Convert the array to a Set (unique values only)
                let IPSet = new Set(minute.IPs);
                // Convert the set back to an array and replace the old one.
                minute.IPs = Array.from(IPSet);
            }
            let output = "";
            // Convert the array to a CSV.
            for (let minute of minutes) {
                output += minute.minute + ":00," + dayjs(minute.minute).subtract(4, "hours").format("YYYY-MM-DD HH:mm") + ":00," + minute.IPs.length + "\n";
            }
            fs.writeFile(logFile + "_analytics.csv", outputCSV + output, function (err) {
                if (err) {
                    console.log(err);
                    return console.log("Couldn't write output file");
                }
                console.log("Parsed " + ctr + " files in " + dayjs().diff(startTime, "milliseconds") + "ms");
            });
        })
    }
});
