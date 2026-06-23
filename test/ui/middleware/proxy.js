const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function ({ log, middlewareUtil, options, resources }) {
    const companyManagementProxyV2 = createProxyMiddleware({
        context: "/odata/v2/company-management/",
        target: "http://localhost:4004",
        changeOrigin: true,
        pathRewrite: {
            "^/odata/v2/company-management/": "/odata/v2/company-management/"
        },
        secure: false
    });

    const companyManagementProxyV4 = createProxyMiddleware({
        context: "/odata/v4/company-management/",
        target: "http://localhost:4004",
        changeOrigin: true,
        pathRewrite: {
            "^/odata/v4/company-management/": "/odata/v4/company-management/"
        },
        secure: false
    });

    return function (req, res, next) {
        if (req.url.startsWith("/odata/v2/company-management/")) {
            companyManagementProxyV2(req, res, next);
        } else if (req.url.startsWith("/odata/v4/company-management/")) {
            companyManagementProxyV4(req, res, next);
        } else {
            next();
        }
    };
};