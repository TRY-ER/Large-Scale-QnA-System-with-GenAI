

const baseParse = (content: string) =>{
    
}


const removeHtmlTags = (content: string) =>{
    return content.replace(/<[^>]*>/g, '');
}


export {removeHtmlTags} 