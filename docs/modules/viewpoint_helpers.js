export {getEntriesFilteredByTags}

const getEntriesFilteredByTags = function () {
    {
        let selectedTags = getSelectedTags()
        let configuration = getCurrentConfiguration()
        let allTags = configuration.all_tags
        if (selectedTags && selectedTags.length > 0) {
          const filterededEntries = configuration.getEntries(true).filter((entry) => {  // any entry in selectedTages has to correspond with any entry in entry.tags
            const intersection = (entry.tags && (entry.tags.filter(x => selectedTags.includes(x))))
            if (allTags)
              return (intersection && intersection.length == selectedTags.length) ? entry : null
            else
              return (intersection && intersection.length > 0) ? entry : null
          })
          return filterededEntries
        }
        else return radarEntries
      }
}