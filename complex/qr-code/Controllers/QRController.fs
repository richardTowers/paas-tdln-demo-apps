namespace question_submit.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open QRCoder

[<Route("api/[controller]")>]
[<ApiController>]
type QRController () =
    inherit ControllerBase()

    [<HttpGet>]
    member this.Get([<FromQuery>] url: string) =
        use qrGenerator = new QRCodeGenerator()
        let qrData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q)
        use qr = new PngByteQRCode(qrData)
        qr.GetGraphic(20) |> Convert.ToBase64String
