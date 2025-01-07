import ProgressBar from "https://deno.land/x/progressbar@v0.2.0/progressbar.ts";
import {
  percentageWidget,
  amountWidget,
} from "https://deno.land/x/progressbar@v0.2.0/widgets.ts";


type IpTV = {
    channel: string,
    url: string,
    opt: string,
    attrs: Array<string>
}

type ChannelInfo = {
    channel: string,
    niceName: string,
    group: string
}

async function filterAndTransform(lines: string[], whiteList: Array<ChannelInfo>): Promise<string> {    
    let data: Array<IpTV> = [];
    
    console.log(`==> parsing source total lines [${lines.length}]`)

    const pb = new ProgressBar({ total: lines.length, widgets: [percentageWidget, amountWidget] });

    lines.forEach(async (line, index) => {
        await pb.update(index)
        if(line.includes("#EXTINF")) {
            let attr = line.split(" ")
            let channel = attr.filter(x => x.includes("tvg-id"))[0].split("=")[1]
            let opts = ""
            let url = ""
            if((index + 1)+1 < lines.length) {
                if(lines[index+1].includes("#EXTVLCOPT")) {
                    if((index+1)+2 < lines.length) {
                        // console.log(channel + " --> [" + lines[index+1] + "]" + " ||||" + lines[index+2])
                        opts = lines[index+1]
                        url = lines[index+2]
                    }
                } else {
                    // console.log(channel + " --> " + lines[index+1])
                    url = lines[index+1]
                }
            } else {
                // console.log(channel)
            }
            data.push({
                channel: channel,
                opt: opts,
                url: url,
                attrs: attr
            })
        }
    })

    await pb.finish();
    
    console.log(`==> total parsed channels [${data.length}]`)
    console.log(`==> filtering channels based on whitelist [${whiteList.length}]`)

    let ok = RegExp(whiteList.map(x => x.channel.toLocaleLowerCase()).join("|"));
    const finalChannels: Array<IpTV> = [];
    const selectedChannels = data.filter( x => ok.test(x.channel.toLocaleLowerCase()) );

    console.log(`==> total filtered channels -> (${selectedChannels.length})`)
    console.log("==> removing duplicates...")

    selectedChannels.forEach(
        channel => {
            if(finalChannels.filter(x => x.channel === channel.channel).length == 0) {
                finalChannels.push(channel)
            }
        }
    )

    console.log(`==> duplicates removed -> (${selectedChannels.length - finalChannels.length})`)
    
    let ukEPG = "https://iptv-org.github.io/epg/guides/uk/sky.com.epg.xml"
    let usEPG = "https://iptv-org.github.io/epg/guides/us-local/tvtv.us.epg.xml"
    
    let m3u = `#EXTM3U x-tvg-url="${ukEPG},${usEPG}"\n\n`
    
    console.log("==> generating m3u....")

    finalChannels.forEach( c => {
        let targetC = c.channel.replace(/\"/g, "")
        // console.log(targetC)
        let wl = whiteList.filter(x => targetC.includes(x.channel))[0]
        if(wl) {
            m3u += `#EXTINF:-1 tvg-id="${c.channel}" tvg-country="UK" tvg-language="English" ${c.attrs.filter(x => x.includes("tvg-logo"))[0]}" group-title="${wl.group}", ${wl.niceName}\n`
            if(c.opt != "") {
                m3u += c.opt + "\n"
            }
            m3u += c.url + "\n"
        }
    })
    return m3u
}

export { 
    filterAndTransform,
}

export type { ChannelInfo }
