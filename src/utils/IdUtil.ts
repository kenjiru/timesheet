class IdUtil {
    static newId() {
        return _.reduce(_.range(4), (result, item) => {
            return result += IdUtil.newSegment();
        }, "");
    }

    private static newSegment():string {
        return Math.floor((1 + Math.random()) * 10e8).toString(16);
    }
}

export default IdUtil;