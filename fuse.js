const {
    FuseBox,
    WebIndexPlugin,
    JSONPlugin,
    HTMLPlugin,
    LESSPlugin,
    CSSPlugin,
    QuantumPlugin
} = require('fuse-box');

const isProduction = process.env.NODE_ENV === 'production';

const appPackages = '!> [index.js]';
const vendorPackages = '~ index.js';

const fuse = FuseBox.init({
    homeDir: 'src',
    target: 'browser',
    hash: true,
    log: true,
    debug: true,
    output: 'build/$name.js',
    useTypescriptCompiler: true,
    plugins: [
        WebIndexPlugin({
            template: 'src/index.html'
        }),
        JSONPlugin(),
        HTMLPlugin(),
        [
            LESSPlugin(),
            CSSPlugin({
                inject: () => '/style.css',
                outFile: () => './build/style.css'
            })
        ],
        isProduction && QuantumPlugin({
            bakeApiIntoBundle: 'vendor',
            treeshake: true,
            uglify: true
        })
    ]
});

// vendor should come first
fuse.bundle('vendor').instructions(vendorPackages);
const app = fuse.bundle('app').instructions(appPackages);

if (!isProduction) {
    fuse.dev();
    app.hmr().watch();
}

fuse.run();
