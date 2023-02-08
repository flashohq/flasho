unlayer.registerTool({
    type: 'whatever',
    category: 'contents',
    label: 'Image',
    icon: 'fa-image',
    values: {
        width: '100%',
    },
    options: {
        default: {
            title: null,
        },
        Image: {
            title: "Image",
            position: 1,
            options: {
                "uri": {
                    "label": "Image URL",
                    "defaultValue": "https://cdn.tools.unlayer.com/image/placeholder.png",
                    "widget": "text"
                },
                "align": {
                    "label": "Align",
                    "defaultValue": "center",
                    "widget": "alignment"
                }
            },
        }
    },
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                const {uri, align, width} = values
                
                return `
                    <span style="text-align:${align};display:block;"> 
                        <img style="max-width:${width};" src=${uri} ></img>
                    </span>
                `
            }
        }),
        exporters: {
            web: function(values) {
                const {uri, align, width} = values
            
                return `
                    <span style="text-align:${align};display:block;"> 
                        <img style="max-width:${width};" src=${uri} ></img>
                    </span>
                `
            },
            email: function(values) {
                const {uri, align, width} = values
            
                return `
                    <span style="text-align:${align};display:block;"> 
                        <img style="max-width:${width};" src=${uri} ></img>
                    </span>
                `
            }
        },
    },
});
