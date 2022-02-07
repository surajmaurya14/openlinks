function blockSpecialChar(e) {
    var k = e.keyCode;
    return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        (k >= 48 && k <= 57)
    );
}
