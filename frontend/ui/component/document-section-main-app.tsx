interface DocumentMainProps {
    documents: [string];
}

export default function DocumentMain(
    {
        documents
    }: DocumentMainProps
) {
    return (
        <div className=" w-full h-full bg-gradient-to-l bg-gray-200 rounded-bl-lg rounded-tl-lg">
            Documents list: 
            <div>
            {
                documents.map((document) => (
                    <div key={document.length}>
                        {document}
                    </div>
                ))
                // documents
            }
            </div>
        </div>
    )
}