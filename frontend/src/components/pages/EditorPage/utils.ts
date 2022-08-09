
const colors = [
    '#f44336',
    '#2196f3',
    '#4caf50',
    '#ef6c00',
    '#795548',
    '#689f38',
    '#e91e63',
    '#9c27b0',
    '#3f51b5',
    '#009688',
    '#cddc39',
    '#607d8b'
]

export const getClassColor = (cls?: string, cls_list?: string[]) => {
    if (!cls || !cls_list) {
        return colors[0]
    }
    const indexClass = cls_list.indexOf(cls)
    if (indexClass < 0){
        return '#f8f9fd'
    }
    return colors[indexClass % colors.length]
}