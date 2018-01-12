const {
    FuseBox,
    WebIndexPlugin,
    JSONPlugin,
    HTMLPlugin,
    LESSPlugin,
    CSSPlugin
} = require('fuse-box');

const appPackages = `
    !> [index.js]`;

const vendorPackages = '~ index.js';

const fuse = FuseBox.init({
    homeDir: 'src',
    target: 'browser@es6',
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
            CSSPlugin()
        ]
    ]
});

// vendor should come first
const vendor = fuse.bundle('vendor')
    .instructions(vendorPackages);

const app = fuse.bundle('app')
    .instructions(appPackages)
    .hmr()
    .watch();

fuse.dev();

fuse.run();
