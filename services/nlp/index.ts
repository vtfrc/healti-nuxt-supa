const nlpService = async (text : string) => {
    const supabase = useSupabaseClient()

    const { data, error: metricQueryError } = await supabase
        .from('metric_names')
        .select('id, name')
    
    if (metricQueryError) throw metricQueryError

    const metrics = data.map(metric => ({
        id: metric.id,
        name: metric.name,
        valorization: null,
    }));

    const lines = text.split('\n');
    const filteredLines = lines.filter(line => line.trim() !== '');

    const mergeCloseWords = (text) => {
        // Replacing multiple spaces with a single space
        const cleanedText = text.replace(/\s+/g, ' ');
        // Removing spaces between characters that are close to each other
        return cleanedText.replace(/(\w) (\w)/g, '$1$2');
    };
    
    const extractValue = (text, keywordRegex) => {
        const mergedText = mergeCloseWords(text);
        const match = mergedText.match(keywordRegex);
    
        // If the keyword does not match, returns null
        if (!match) return null;
    
        const keywordIndex = match.index;
        
        // Extracting the text after the keyword
        const textAfterKeyword = mergedText.substring(keywordIndex + match[0].length).trim();
        
        // Matching the first number in the text after the keyword
        const matchValue = textAfterKeyword.match(/\d+/);
        
        return matchValue ? matchValue[0] : null;
    };    
    
    for (let metric of metrics) {
        filteredLines.forEach(line => {
            const regexMetric = new RegExp(metric.name.replace(/_/g, ' '), 'i');
            console.log(regexMetric);
            const value = extractValue(line, regexMetric);
            console.log(value);
            if (value !== null) {
                metric.valorization = value;
            }
        });
    }
    
    return metrics;
};

export default nlpService;
