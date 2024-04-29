
Module.register("MMM-UpdateChecker", {
    defaults: {},
    start: function () { },
    start: function () {
        // this.count = 0
        // var timer = setInterval(() => {
        //     this.updateDom()
        //     this.count++
        // }, 5000)
    },

    getDom: function () {

        // var element = document.createElement("div")
        // element.className = "myContent"
        // element.innerHTML = "Hello, World! "
        // var subElement = document.createElement("p")
        // //subElement.innerHTML = "Count:" + this.count + " res " + res
        // subElement.innerHTML = "Count:" + this.count
        // subElement.id = "COUNT"
        // element.appendChild(subElement)
        // return element

        var element = document.createElement("div");
        var subElement = document.createElement("p");
        subElement.id = "UCHECKER";
        element.appendChild(subElement);
        return element;
    },
    notificationReceived: function (notification, payload, sender) {
        switch (notification) {
            case "DOM_OBJECTS_CREATED":
                var timer = setInterval(() => {
                    this.sendSocketNotification("DO_YOUR_JOB", this.count)
                    this.count++
                }, 10000)
                break
        }
    },
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "I_DID":
                var elem = document.getElementById("UCHECKER")
                elem.innerHTML = payload
                break
        }
    },
})