import { Component, Input } from "@angular/core";
import { LayoutService } from "../../services/layout.service";

@Component({
  selector: "app-svg-icon",
  templateUrl: "./svg-icon.component.html",
  styleUrls: ["./svg-icon.component.scss"],
})
export class SvgIconComponent {
  @Input("icon") public icon;
  public iconValue;
  constructor(public layOut: LayoutService) {}

  getSvgType() {
    return document.getElementsByClassName("sidebar-wrapper")[0].getAttribute("icon") == "stroke-svg";
  }
}
