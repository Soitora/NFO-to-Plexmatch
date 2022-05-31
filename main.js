import "dotenv/config"
import "colors"
import * as fs from "fs"
import readline from "readline"
import xml2js from "xml2js"
import walkSync from "walk-sync"

console.log("Master, I'm starting the nekoinator nya~".bold.cyan)

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

rl.question("Input path for folders: ", (input) => {
	async function generateFiles() {
		const paths = walkSync(input, {globs: ["**/tvshow.nfo"]})
		console.log("--- GENERATING".yellow + "\n")
		for await (const files of paths) {
			const path = input + "\\" + files
			const data = fs.readFileSync(path, "utf8")
			var parser = new xml2js.Parser()
			parser.parseStringPromise(data).then(function (result) {		
				try {
					let content = ""
					if (result.tvshow.title != undefined) {
						let title = result.tvshow.title[0]
						content += `title: ${title}\n`
						console.log("title: " + title.cyan)
					} else {
						console.log("title: " + "N/A".red)
					}
					if (result.tvshow.tmdbid != undefined) {
						let tmdb = result.tvshow.tmdbid[0]
						content += `tmdbid: ${tmdb}\n`
						console.log("tmdbid: " + tmdb.grey)
					} else {
						console.log("tmdbid: " + "N/A".red)
					}
					if (result.tvshow.tvdbid != undefined) {
						let tvdb = result.tvshow.tvdbid[0]
						content += `tvdbid: ${tvdb}\n`
						console.log("tvdbid: " + tvdb.grey)
					} else {
						console.log("tvdbid: " + "N/A".red)
					}
					if (result.tvshow.imdb_id != undefined) {
						let imdb = result.tvshow.imdb_id[0]
						content += `imdbid: ${imdb}\n`
						console.log("imdbid: " + imdb.grey)
					} else {
						console.log("imdbid: " + "N/A".red)
					}
					console.log("path: " + path.replace("tvshow.nfo", "").grey + "\n")

					fs.writeFileSync(path.replace("tvshow.nfo", ".plexmatch"), content)

				} catch (err) { console.log(err) }
		
			}).catch(function (err) { console.log(err) })
		}
		console.log("--- DONE".green)
		rl.close()
	}
	generateFiles()
})

/* Get data from TMDB API - Thanks to @ghostbear for help; did turn out to be redundant
import MovieDB from "node-themoviedb"
const mdb = new MovieDB(process.env.TMDB_API)

try {
	const externalIds = await mdb.tv.getExternalIDs({
		pathParameters: {
			tv_id: 67043,
		},
	})
	console.log(externalIds.data.tvdb_id)
} catch (err) { console.log(err) }
*/