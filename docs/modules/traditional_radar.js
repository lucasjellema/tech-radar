export { config }
import { getEntriesFilteredByTags, getKeyForValue } from './viewpoint_helpers.js'

const relevanceColorMap = { 0: "lightgray", 1: "green", 2: "orange", 3: "red" }
const communityRatingShapeMap = { 0: "triangleDown", 1: "square", 2: "triangleUp", 3: "star" }
let config = {
  svg_id: "radar",
  width: 1450,
  height: 1000,
  colors: {
    background: "#fff",
    grid: "#bbb",
    inactive: "#ddd"
  },
  title: "AMIS | Conclusion Tech Radar — 2021.01",
  label: "Traditional Radar",
  dataSetLabel: "conclusion-technologies",

  quadrants: [
    { name: "Languages" },
    { name: "Infrastructure" },
    { name: "Frameworks" },
    { name: "Data Management" }
  ],
  rings: [
    { name: "ADOPT", color: "#93c47d" },
    { name: "TRIAL", color: "#93d2c2" },
    { name: "ASSESS", color: "#fbdb84" },
    { name: "HOLD", color: "#efafa9" }
  ], blipColors: {
    "colorTitle": "Relevance"
    , colorOptions: relevanceColorMap
  }, blipSizes: { sizeTitle: "Magnitude" },
  blipShapes: { shapeTitle: "Community Rating" 
, shapeOptions: communityRatingShapeMap},
  show_logos: false,
  blip_displayStyle: "shapes"
  , all_tags: false
  , print_layout: true,
  // zoomed_quadrant: 0,
  //ENTRIES
  entries: radarEntries,
  getEntries: (noFilter) => { return (noFilter ? radarEntries : getEntriesFilteredByTags()) }
  , getRing: (entry) => {
    const r = ambitionRingMap[entry.ambition]
    return (r != null) ? r : (entry.ring ? entry.ring : -1)
  }
  , getQuadrant: (entry) => {
    const q = categoryQuadrantMap[entry.category]
    return (q != null) ? q : (entry.quadrant ? entry.quadrant : 3)
  }
  , getSize: (entry) => {
    return (entry != null && entry.magnitude != null) ? entry.magnitude : 1
  },
  handleSizePick: (entry, size) => {
    entry.magnitude = size
  }
  , getShape: (entry) => {
    let shape = "circle"
    const q = communityRatingShapeMap[entry.communityRating]
    return (q != null) ? q : shape

  },
  handleShapePick: (entry, shapeLabel) => {
    entry.communityRating = getKeyForValue(communityRatingShapeMap, shapeLabel)
  }
  , handleSectorDrop: (entry, sector) => {
    console.log(`handleSectorDrop ${JSON.stringify(entry)} : ${JSON.stringify(sector)}`)
    // if sector.quadrant <> getQuadrant(entry) then map sector.quadrant to category
    const category = getKeyForValue(categoryQuadrantMap, sector.quadrant)
    entry.category = category
    
    const ambition = getKeyForValue(ambitionRingMap, sector.ring)
    entry.ambition = ambition
    console.log(`derived category and ambition ${category} and ${ambition} for ${JSON.stringify(entry)}`)
    
  }, getColor: (entry) => {
    return entry.relevance ? relevanceColorMap[entry.relevance] : "green"
  }
  , handleColorPick: (entry, color) => {
    entry.relevance = getKeyForValue(relevanceColorMap, color)
  }
  , addEntry : () => { radarEntries.push({"label":"NEW"})

  }

}
const ambitionRingMap = { 0: 3, 5: 3, 1: 2, 2: 1, 3: 0, 4: 0 }
const categoryQuadrantMap = { "platform": 3, "infra": 1, "language": 0, "tool": 2, "library": 2, "framework": 2, "concept": 2 }


