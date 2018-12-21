namespace QrCodeTests

open System
open Microsoft.VisualStudio.TestTools.UnitTesting
open question_submit.Controllers

[<TestClass>]
type QRControllerTests () =

    [<TestMethod>]
    member this.GeneratesQrCodes () =
        let controller = QRController()
        let result = controller.Get("banana")
        Assert.AreEqual(
          result,
          "iVBORw0KGgoAAAANSUhEUgAAAkQAAAJEAQAAAADfmwb3AAABg" +
          "ElEQVR4nO3YTW6EMAwG0NyA+98yN6CdCsb5m+mi1WCk5xVK/L2" +
          "wwihl/6eqhUQikUgkEolEIpFIJBKJRCKRSKQ7SmWs7bG2te2rF" +
          "hKJRCKlkYbU1udXMIlEIpGSSVOqth/+dQuJRCKREkv79EQikUi" +
          "k+0ilqY1EIpFI+aU1/F0vW0gkEomURhoqRsBqQJwtJBKJREoir" +
          "as+hkHtU+s+EolEIl0t1emL/7McT4P5eiKQSCQS6fPSsV7bVEj" +
          "Dbvztk0gkEimXFNHIn2vD7t4UiUQikVJIbcd5OdMHmiPeTgQSi" +
          "UQifVw6kdLXtBv59ggSiUQiXSut6sjXHq4Lk0QikUhXS2Ws7bl" +
          "2/sUf0hHt3oJEIpFI10vdH/twBxPmMSB+u+shkUgk0hVSBCbpR" +
          "J7R9xOBRCKRSFmk1lwNAxKJRCJll0p7vx4ciUQikdJJEzx8/Ws" +
          "pcRiJRCKRcklDbW00JkJskEgkEimT9LcikUgkEolEIpFIJBKJR" +
          "CKRSCQS6UbSF5BWisMz6LJhAAAAAElFTkSuQmCC");
