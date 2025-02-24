"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = exports.KafkaConfig = void 0;
// utils/kafka.ts
var kafkajs_1 = require("kafkajs");
var KafkaConfig = /** @class */ (function () {
    function KafkaConfig() {
        this.producer = null;
        this.consumer = null;
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'nodejs-kafka',
            brokers: ['education-kafka.dowhilelearn.svc.cluster.local:29092'],
            retry: {
                maxRetryTime: 60000, // 60 seconds
            },
            connectionTimeout: 10000, // 10 seconds
            requestTimeout: 25000, // 25 seconds
        });
    }
    KafkaConfig.getInstance = function () {
        if (!KafkaConfig.instance) {
            KafkaConfig.instance = new KafkaConfig();
        }
        return KafkaConfig.instance;
    };
    KafkaConfig.prototype.getProducer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.producer) return [3 /*break*/, 2];
                        this.producer = this.kafka.producer();
                        return [4 /*yield*/, this.producer.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.producer];
                }
            });
        });
    };
    KafkaConfig.prototype.getConsumer = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.consumer) return [3 /*break*/, 2];
                        this.consumer = this.kafka.consumer({ groupId: groupId });
                        return [4 /*yield*/, this.consumer.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.consumer];
                }
            });
        });
    };
    KafkaConfig.prototype.sendMessage = function (topic, message) {
        return __awaiter(this, void 0, void 0, function () {
            var producer, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getProducer()];
                    case 1:
                        producer = _a.sent();
                        return [4 /*yield*/, producer.send({
                                topic: topic,
                                messages: [{ value: JSON.stringify(message) }]
                            })];
                    case 2:
                        _a.sent();
                        console.log("Message sent to topic ".concat(topic, ":"), message);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error sending message to ".concat(topic, ":"), error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KafkaConfig.prototype.consumeMessages = function (groupId, topics, messageHandler) {
        return __awaiter(this, void 0, void 0, function () {
            var consumer_1, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getConsumer(groupId)];
                    case 1:
                        consumer_1 = _a.sent();
                        return [4 /*yield*/, Promise.all(topics.map(function (topic) { return consumer_1.subscribe({ topic: topic }); }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, consumer_1.run({
                                eachMessage: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var _c;
                                    var topic = _b.topic, partition = _b.partition, message = _b.message;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                console.log(partition);
                                                console.log("Received message from topic ".concat(topic, ":"), (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString());
                                                return [4 /*yield*/, messageHandler(topics, message, topic)];
                                            case 1:
                                                _d.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error consuming messages:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return KafkaConfig;
}());
exports.KafkaConfig = KafkaConfig;
exports.kafkaConfig = KafkaConfig.getInstance();
