const {
    FuseBox,
    BabelPlugin,
    SassPlugin,
    CSSPlugin,
    EnvPlugin,
    QuantumPlugin
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: 'src',
    package: 'sovereignty-elite-telemetry',
    output: 'dist/$name.js',
    useTypescriptCompiler: true,
    target: 'server',
    plugins: [
        EnvPlugin({ NODE_ENV: 'production' }),
        [SassPlugin({
            outputStyle: 'compressed'
        }), CSSPlugin()],
        QuantumPlugin({
            target : 'server',
            treeshake : true,
            uglify : true,
            bakeApiIntoBundle : 'server',
            containedAPI : true
        }),
        BabelPlugin({
            limit2project: false
        })
    ]
});

fuse.bundle('server')
    .instructions(' > [server/index.js]');

fuse.run();
