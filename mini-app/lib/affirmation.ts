/**
 * Transforms affirmation text from second person to first person.
 * @example toFirstPerson("You are amazing") → "I am amazing"
 * @example toFirstPerson("Your life is great") → "My life is great"
 * @example toFirstPerson("Mistakes don't make you less capable") → "Mistakes don't make me less capable"
 * @example toFirstPerson("All you need is love") → "All I need is love"
 */
export function toFirstPerson(text: string): string {
    return text
        // Subject pronouns: You → I (with common verbs and modals)
        .replace(/\bYou are\b/gi, 'I am')
        .replace(/\bYou're\b/gi, "I'm")
        .replace(/\bYou have\b/gi, 'I have')
        .replace(/\bYou've\b/gi, "I've")
        .replace(/\bYou had\b/gi, 'I had')
        .replace(/\bYou will\b/gi, 'I will')
        .replace(/\bYou'll\b/gi, "I'll")
        .replace(/\bYou would\b/gi, 'I would')
        .replace(/\bYou'd\b/gi, "I'd")
        .replace(/\bYou can\b/gi, 'I can')
        .replace(/\bYou could\b/gi, 'I could')
        .replace(/\bYou should\b/gi, 'I should')
        .replace(/\bYou must\b/gi, 'I must')
        .replace(/\bYou might\b/gi, 'I might')
        .replace(/\bYou may\b/gi, 'I may')
        .replace(/\bYou shall\b/gi, 'I shall')
        .replace(/\bYou need\b/gi, 'I need')
        .replace(/\bYou want\b/gi, 'I want')
        .replace(/\bYou deserve\b/gi, 'I deserve')
        .replace(/\bYou know\b/gi, 'I know')
        .replace(/\bYou were\b/gi, 'I was')
        .replace(/\bYou do\b/gi, 'I do')
        .replace(/\bYou don't\b/gi, "I don't")
        .replace(/\bYou didn't\b/gi, "I didn't")
        .replace(/\bYou did\b/gi, 'I did')
        .replace(/\bYou won't\b/gi, "I won't")
        .replace(/\bYou can't\b/gi, "I can't")
        .replace(/\bYou couldn't\b/gi, "I couldn't")
        .replace(/\bYou shouldn't\b/gi, "I shouldn't")
        .replace(/\bYou wouldn't\b/gi, "I wouldn't")
        .replace(/\bYou haven't\b/gi, "I haven't")
        .replace(/\bYou hadn't\b/gi, "I hadn't")
        .replace(/\bYou aren't\b/gi, "I'm not")
        .replace(/\bYou weren't\b/gi, "I wasn't")
        .replace(/\bYou mustn't\b/gi, "I mustn't")
        // Possessive & reflexive
        .replace(/\bYour\b/gi, 'My')
        .replace(/\bYours\b/gi, 'Mine')
        .replace(/\bYourself\b/gi, 'Myself')
        // "you" as subject before verbs (mid-sentence: "All you need", "what you want")
        .replace(/\byou (need|needs|want|wants|deserve|deserves|know|knows|think|thinks|feel|feels|believe|believes|see|sees|saw|seen|create|creates|created|choose|chooses|chose|chosen|decide|decides|decided|find|finds|found|get|gets|got|gotten|give|gives|gave|given|go|goes|went|gone|grow|grows|grew|grown|have|has|had|hold|holds|held|keep|keeps|kept|learn|learns|learned|learnt|live|lives|lived|look|looks|looked|love|loves|loved|make|makes|made|matter|matters|mattered|mean|means|meant|move|moves|moved|own|owns|owned|say|says|said|seek|seeks|sought|set|sets|start|starts|started|take|takes|took|taken|try|tries|tried|use|uses|used|work|works|worked|shine|shines|shone|shined|rise|rises|rose|risen|become|becomes|became|bring|brings|brought|build|builds|built|carry|carries|carried|change|changes|changed|come|comes|came|conquer|conquers|conquered|control|controls|controlled|define|defines|defined|discover|discovers|discovered|dream|dreams|dreamed|dreamt|embrace|embraces|embraced|exist|exists|existed|face|faces|faced|fail|fails|failed|fear|fears|feared|fight|fights|fought|flourish|flourishes|flourished|follow|follows|followed|forgive|forgives|forgave|forgiven|handle|handles|handled|heal|heals|healed|hope|hopes|hoped|imagine|imagines|imagined|inspire|inspires|inspired|lead|leads|led|leave|leaves|left|listen|listens|listened|manifest|manifests|manifested|overcome|overcomes|overcame|persist|persists|persisted|possess|possesses|possessed|radiate|radiates|radiated|reach|reaches|reached|realize|realizes|realized|receive|receives|received|remember|remembers|remembered|shape|shapes|shaped|stand|stands|stood|succeed|succeeds|succeeded|survive|survives|survived|thrive|thrives|thrived|throve|transform|transforms|transformed|trust|trusts|trusted|understand|understands|understood|walk|walks|walked|win|wins|won|belong|belongs|belonged|accept|accepts|accepted|achieve|achieves|achieved|attract|attracts|attracted|breathe|breathes|breathed|celebrate|celebrates|celebrated|claim|claims|claimed|commit|commits|committed|connect|connects|connected|continue|continues|continued|contribute|contributes|contributed|count|counts|counted|dare|dares|dared|do|does|did|done|earn|earns|earned|embody|embodies|embodied|empower|empowers|empowered|enjoy|enjoys|enjoyed|evolve|evolves|evolved|express|expresses|expressed|finish|finishes|finished|focus|focuses|focused|gain|gains|gained|glow|glows|glowed|honor|honors|honored|impact|impacts|impacted|improve|improves|improved|invest|invests|invested|navigate|navigates|navigated|nurture|nurtures|nurtured|open|opens|opened|pause|pauses|paused|persevere|perseveres|persevered|practice|practices|practiced|prioritize|prioritizes|prioritized|progress|progresses|progressed|prosper|prospers|prospered|protect|protects|protected|provide|provides|provided|pursue|pursues|pursued|reflect|reflects|reflected|release|releases|released|remain|remains|remained|respect|respects|respected|rest|rests|rested|rule|rules|ruled|share|shares|shared|show|shows|showed|shown|speak|speaks|spoke|spoken|stay|stays|stayed|step|steps|stepped|stretch|stretches|stretched|strive|strives|strove|striven|support|supports|supported|teach|teaches|taught|welcome|welcomes|welcomed|wonder|wonders|wondered|write|writes|wrote|written|act|acts|acted|allow|allows|allowed|amaze|amazes|amazed|appreciate|appreciates|appreciated|ask|asks|asked|be|been|being|begin|begins|began|begun|call|calls|called|care|cares|cared|cause|causes|caused|close|closes|closed|consider|considers|considered|contain|contains|contained|develop|develops|developed|draw|draws|drew|drawn|drink|drinks|drank|drunk|drive|drives|drove|driven|eat|eats|ate|eaten|end|ends|ended|enter|enters|entered|expect|expects|expected|explain|explains|explained|fall|falls|fell|fallen|fill|fills|filled|fly|flies|flew|flown|form|forms|formed|free|frees|freed|hear|hears|heard|help|helps|helped|hit|hits|include|includes|included|increase|increases|increased|join|joins|joined|kill|kills|killed|lay|lays|laid|let|lets|lie|lies|lay|lain|lift|lifts|lifted|light|lights|lit|lighted|lose|loses|lost|meet|meets|met|miss|misses|missed|must|notice|notices|noticed|occur|occurs|occurred|offer|offers|offered|pass|passes|passed|pay|pays|paid|pick|picks|picked|plan|plans|planned|play|plays|played|point|points|pointed|present|presents|presented|pull|pulls|pulled|put|puts|push|pushes|pushed|raise|raises|raised|read|reads|reduce|reduces|reduced|relate|relates|related|require|requires|required|return|returns|returned|run|runs|ran|save|saves|saved|seem|seems|seemed|sell|sells|sold|send|sends|sent|serve|serves|served|sit|sits|sat|sleep|sleeps|slept|sound|sounds|sounded|spend|spends|spent|spread|spreads|stop|stops|stopped|study|studies|studied|suffer|suffers|suffered|suggest|suggests|suggested|talk|talks|talked|test|tests|tested|thank|thanks|thanked|touch|touches|touched|train|trains|trained|travel|travels|traveled|travelled|treat|treats|treated|turn|turns|turned|visit|visits|visited|wait|waits|waited|wake|wakes|woke|woken|want|wants|wanted|watch|watches|watched|wear|wears|wore|worn|wish|wishes|wished)\b/gi, 'I $1')
        // Object pronouns: "verb/preposition + you" → "verb/preposition + me"
        .replace(/\b(make|makes|making|made|help|helps|helping|helped|give|gives|giving|gave|given|tell|tells|telling|told|show|shows|showing|showed|shown|bring|brings|bringing|brought|keep|keeps|keeping|kept|let|lets|letting|remind|reminds|reminding|reminded|allow|allows|allowing|allowed|teach|teaches|teaching|taught|lead|leads|leading|led|guide|guides|guiding|guided|push|pushes|pushing|pushed|hold|holds|holding|held|send|sends|sending|sent|ask|asks|asking|asked|call|calls|calling|called|thank|thanks|thanking|thanked|love|loves|loving|loved|hate|hates|hating|hated|need|needs|needing|needed|want|wants|wanting|wanted|require|requires|requiring|required|serve|serves|serving|served|support|supports|supporting|supported|protect|protects|protecting|protected|follow|follows|following|followed|join|joins|joining|joined|meet|meets|meeting|met|greet|greets|greeting|greeted|welcome|welcomes|welcoming|welcomed|invite|invites|inviting|invited|inspire|inspires|inspiring|inspired|motivate|motivates|motivating|motivated|encourage|encourages|encouraging|encouraged|empower|empowers|empowering|empowered|lift|lifts|lifting|lifted|carry|carries|carrying|carried|save|saves|saving|saved|free|frees|freeing|freed|heal|heals|healing|healed|forgive|forgives|forgiving|forgave|forgiven|bless|blesses|blessing|blessed|trust|trusts|trusting|trusted|believe|believes|believing|believed|for|to|with|about|around|within|toward|towards|in|on|at|of|from|inside|behind|beside|between|against|upon|into|onto|through|before|after|above|below|beneath|under|over|near|by|beside|besides|past|beyond|without|except|during|like|unlike|despite|than|as) you\b/gi, '$1 me')
        // Remaining "You" at start of sentence → I
        .replace(/^You\b/gm, 'I')
        // Handle "You" mid-sentence as subject (after punctuation)
        .replace(/([.!?]\s+)You\b/g, '$1I')
        // Remaining "you" that weren't caught → me (likely objects)
        .replace(/\byou\b/g, 'me');
}
