"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateCouseService = /** @class */ (function () {
    function CreateCouseService() {
    }
    CreateCouseService.prototype.execute = function (_a) {
        var duration = _a.duration, educator = _a.educator, name = _a.name;
        console.log(name, duration, educator);
    };
    return CreateCouseService;
}());
exports.default = new CreateCouseService();
