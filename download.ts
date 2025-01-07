async function grabAllChannels () {
    console.log("==> downloading all sources...")
    const sourceUrl = "https://iptv-org.github.io/iptv/index.m3u";
    let reponse = await fetch(sourceUrl);
    let body = await reponse.text();
    let _ = await Deno.writeTextFile("all.m3u", body)
}

async function loadAllChannels() : Promise<string[]> {
    console.log("==> attempting to read all m3u data...")
    let rawUK = await Deno.readTextFile("all.m3u");
    let lines  = rawUK.split("\n");
    return lines;
}

export { 
    grabAllChannels,  
    loadAllChannels
};
