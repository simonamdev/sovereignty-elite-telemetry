const {
    FuseBox,
    HTMLPlugin,
    WebIndexPlugin,
    BabelPlugin,
    SassPlugin,
    CSSPlugin,
    EnvPlugin,
    SVGPlugin
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'dist/$name.js',
    useTypescriptCompiler: true,
    sourceMaps: true,
    target: 'browser',
    plugins: [
        EnvPlugin({ NODE_ENV: 'development' }),
        // WebIndexPlugin({
        //     // path: './static/'
        //     path: './'
        // }),
        // SVGPlugin(),
        // [SassPlugin(), CSSPlugin()],
        BabelPlugin({
            limit2project: false
        })
    ]
});

fuse.dev({
    port: 4445,
    httpServer: false
});

fuse.bundle('server/bundle')
    .watch('server/**')
    .instructions(' > [server/index.js]')
    // launch and restart express
    .completed(proc => proc.start())


fuse.bundle('client/app')
    .watch('client/**')
    .hmr({reload : true})
    .instructions('> client/index.js');

fuse.run();
