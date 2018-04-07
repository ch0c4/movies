"use strict";

var _ = require('underscore');
var Pg = require('./../lib/db');

exports.fetchAll = () => {
    var query = `SELECT m.title, m.release_year, m.creation_date, g.title as genre, m.for_kids, m.rating 
    FROM movies m
    INNER JOIN genres_movies gm ON m.id = gm.movie_id
    INNER JOIN genres g ON gm.genre_id = g.id`;
    return new Promise((resolve, reject) => {
        var pg = new Pg();
        pg.connect().then(() => {
            return pg.executeQuery(query);
        }).then((result) => {
            resolve(parseResult(result));            
        }, (err) => {
            reject(err);
        });
    });
};

exports.fetchById = (id) => {
    var query = `SELECT m.title, m.release_year, m.creation_date, g.title as genre, m.for_kids, m.rating 
    FROM movies m
    INNER JOIN genres_movies gm ON m.id = gm.movie_id
    INNER JOIN genres g ON gm.genre_id = g.id
    WHERE m.id = ${id}`;
    return new Promise((resolve, reject) => {
        var pg = new Pg();
        pg.connect().then(() => {
            return pg.executeQuery(query);
        }).then((result) => {
            resolve(parseResult(result));  
        }, (err) => {
            reject(err);
        });
    });
};

exports.createMovie = (data) => {
    var query1 = `INSERT INTO movies (title, release_year, creation_date, for_kids, rating) VALUES
    ($1, $2, $3, $4, $5) 
    RETURNING *`;
    
    var genres = data.genres.join('\',\'');
    var query2 = `SELECT id FROM genres WHERE title IN ('${genres}')`;
    
    delete data.genres;
    data = Object.values(data);
    
    return new Promise((resolve, reject) => {
        var pg = new Pg();
        var idGenres = [];
        pg.connect().then(() => {
            return pg.executeQuery(query2)
        }).then((result) => {
            idGenres = result.rows.map(elm => elm.id);
            return pg.executeQueryWithData(query1, data);
        }).then((result) => {
            var idMovie = result.rows[0].id;
            var lastQuery = 'INSERT INTO genres_movies VALUES ';
            for(var id in idGenres) {
                var idGenre = idGenres[id];
                lastQuery += `(${idGenre}, ${idMovie}),`
            }
            return pg.executeQuery(lastQuery.slice(0, -1));
        }).then(() => {
            resolve({message: "Movie successfully added"});
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
};

exports.updateMovie = (id, data) => {
    var query = `UPDATE movies `;
    var index = 1;
    for(var key in data) {
        if(key === 'genres') continue;
        query += `SET ${key} = $${index},`
        index++;
    }
    query = query.slice(0, -1) + ' WHERE id = ' + id;
    if(data.genres) {
        return new Promise((resolve, reject) => {
            var pg = new Pg();
            pg.connect().then(() => {
                var queryDelete = "DELETE FROM genres_movies WHERE movie_id = " + id;
                return pg.executeQuery(queryDelete);
            }).then(() => {
                var genres = data.genres.join('\',\'');
                var querySelect = `SELECT id FROM genres WHERE title IN ('${genres}')`;
                return pg.executeQuery(querySelect);
            }).then((result) => {
                var idGenres = result.rows.map(elm => elm.id);
                var queryInsert = 'INSERT INTO genres_movies VALUES ';
                for(var idG in idGenres) {
                    var idGenre = idGenres[idG];
                    queryInsert += `(${idGenre}, ${id}),`
                }
                queryInsert = queryInsert.slice(0, -1);
                return pg.executeQuery(queryInsert);
            }).then(() => {
                delete data.genres;
                data = Object.values(data);
                return pg.executeQueryWithData(query, data);
            }).then(() => {
                resolve({message: 'Movie with id ' + id + ' updated'});
            }, (err) => {
                console.log(err);
                reject(err);
            });
        })
    } else {
        return new Promise((resolve, reject) => {
            var pg = new Pg();
            pg.connect().then(() => {
                data = Object.values(data);
                return pg.executeQueryWithData(query, data);
            }).then(() => {
                resolve({message: 'Movie with id ' + id + ' updated'});
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    
}

exports.deleteMovie = (id) => {
    var query1 = 'DELETE FROM movies WHERE id = ' + id;
    var query2 = 'DELETE FROM genres_movies WHERE movie_id = ' + id;
    return new Promise((resolve, reject) => {
        var pg = new Pg();
        pg.connect().then(() => {
            return pg.executeQuery(query1);
        }).then(() => {
            return pg.executeQuery(query2);
        }).then(() => {
            resolve({"message": `Movie with id ${id} deleted successfully`})
        }, (err) => {
            reject(err);
        });
    });
};

function parseResult(result) {
    var genres = {};
    for(var id in result.rows) {
        var row = result.rows[id];
        if(genres[row.title] == undefined) {
            genres[row.title] = [];
        }
        genres[row.title].push(row.genre);
    }
    var data = result.rows.map((elm) => {
        return {
            title: elm.title,
            release_year: elm.release_year,
            creation_date: elm.creation_date,
            genres: genres[elm.title],
            for_kids: elm.for_kids,
            rating: elm.rating
        };
    });
    return _.uniq(data, 'title');
}