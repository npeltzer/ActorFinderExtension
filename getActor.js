$(function () {
    $("#kf").hide();
    $("#display").hide();
    chrome.storage.sync.get('actor', function (items) {
        if (items.actor) {
            search(items.actor);
            $("#search").hide();
        }
        else {
            $("#search").show();
        }
    });

    $("form").submit(function () {
        
        search($("#nameField").val());
    });

    chrome.browserAction.setBadgeText({ "text": "" });
    chrome.storage.sync.remove("actor");


});


function search(name) {

    $("#search").hide();
    name = encodeURIComponent(name);
    theMovieDb.search.getPerson({ "query": name },
        function (data) {

            data = JSON.parse(data);
            if (data.results.length == 0) {
                $('#container').remove();
                var error = document.createElement("h1");
                error.innerHTML = "No Actor was Found with the name: " + decodeURIComponent(name);
                $('body').append(error);
            } else {
                var id = data.results[0].profile_path;
                var movies = data.results[0].known_for;
                $("#name").text(data.results[0].name);
                if (id) {
                    var src = theMovieDb.common.getImage({ size: "w500", file: id });
                    $("#display").show();
                    $("#display").attr("src", src);
                }
                $("#kf").show();
                $("#wiki").attr("href", "https://en.wikipedia.org/wiki/" + data.results[0].name);
                $("#wiki").text("Wiki Link");
                for (i = 0; i < movies.length; i++) {
                    var d = document.createElement("div");
                    d.setAttribute("class", "posters");
                    var im = document.createElement("img");
                    var src = theMovieDb.common.getImage({ size: "w500", file: movies[i].poster_path });
                    im.setAttribute("src", src);
                    var p = document.createElement("h3");
                    var title = "";
                    if (movies[i].media_type == "movie") {
                        title = (movies[i].title);
                    } else {
                        title = (movies[i].name);
                    }
                    p.innerHTML = title;
                    d.setAttribute("data-title", title);
                    $("#knownFor").append(d);
                    var a = document.createElement("a");
                    a.appendChild(im);
                    d.appendChild(a);
                    a.setAttribute("class", "links");
                    $.ajax({
                        url: "http://www.omdbapi.com/?t=" + encodeURIComponent(title) + "&y=&plot=short&r=json",
                        type: "GET",
                        async: false,
                        dataType: "json"

                                    , success: function (ret) {

                                       a.setAttribute("href", "http://www.imdb.com/title/" + ret.imdbID + "/?ref_=nv_sr_1")
                                       a.setAttribute("target", "_blank");


                                    }
                    });
                    d.appendChild(p);

                }
                var posters = $(".posters");
              
            }
        }, function (error) { alert(error) });
}