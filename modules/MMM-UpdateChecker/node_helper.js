var NodeHelper = require("node_helper")
const simpleGit = require("simple-git");
const Log = require("logger");


module.exports = NodeHelper.create({
    start: function () {
        this.countDown = 10000000
    },
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "DO_YOUR_JOB":

                var res = ""
                var path = __dirname + "/../../";
                //path = "F:/GitHub/test/SmartMM/"
                Log.log("PATH IS !!!! " + path);

                var git = simpleGit(path);
                const branchName = 'main';
                // git.fetch((error, fetchSummary) => {
                //     if (error) {
                //         Log.error(error + "  ERROR IS !!!!");
                //         return;
                //     }
                //     if (fetchSummary.raw.split('\n').some(line => line.includes('up to date'))) {
                //         Log.log(fetchSummary + "  fetchSummary IS !!!!");
                //         res = "Hello, World!  already up to date.";
                //     } else {
                //         Log.log( "  else IS !!!! fetchSummary " + JSON.stringify(fetchSummary));
                //         res = "available to pull.";
                //     }
                // });


                git.fetch((err, fetchSummary) => {
                    if (err) {
                        console.error('Error occurred while fetching:', err);
                        return;
                    }

                    // Log the fetch summary
                    Log.log('Fetch summary:', fetchSummary);
                    Log.log('Fetch summary Parsed:', JSON.stringify(fetchSummary));

                    git.branch((err, branchSummary) => {
                        if (err) {
                            Log.error('Error occurred while checking branch:', err);
                            return;
                        }
                        Log.log("BRANCH SUMMARY IS " + JSON.stringify(branchSummary))
    
                        // Get information about the specified branch
                        const branchInfo = branchSummary.branches[branchName];
    
                        // Check if the branch has a `ahead` property, indicating that it's ahead of its remote counterpart
                        if (branchInfo && branchInfo.label.includes('behind')) {
                            Log.log(`Branch '${branchName}' is ahead by ${branchInfo.ahead} commit(s). UPDATE PLS ` + branchInfo.label.includes('behind'));
                            res = "Please Update MagicMirror from remote."
                        } else {
                            res = "MagicMirror already up to date.";
                            Log.log(`Branch '${branchName}' is not ahead of its remote counterpart.`);
                        }
                        this.sendSocketNotification("I_DID", res)
                    });
                });


                

                break


        }
    },
})