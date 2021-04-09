import { resetSimulation } from "../index";
import { CONFIG } from "./Config";
import { OrdonencementState, PolitiqueR } from "./Utils";

export function initListners() {
    // Ordonencement Algorithme
    $(document).on("click", 'input[name="ordo"]', function () {
        $('input[name="ordo"]').not(this).prop("checked", false);

        if (this.value === "FCFS") CONFIG.ordonencement = OrdonencementState.FCFS;
        if (this.value === "SSTF") CONFIG.ordonencement = OrdonencementState.SSTF;
    });

    // Politique ralentie
    $(document).on("click", 'input[name="poliR"]', function () {
        $('input[name="poliR"]').not(this).prop("checked", false);

        if (this.value === "Millieu") CONFIG.politiqueR = PolitiqueR.Millieu;
        if (this.value === "Inferieur") CONFIG.politiqueR = PolitiqueR.Inferieur;
        console.log(CONFIG.politiqueR);
    });

    // Nombre elevator
    $("#ElevatorRange").on("change", function () {
        //@ts-ignore
        CONFIG.elevator = parseInt($("#ElevatorRange").val());
    });

    // Nombre etages
    $("#FloorRange").on("change", function () {
        //@ts-ignore
        CONFIG.floor = parseInt($("#FloorRange").val());
        console.log(CONFIG);
    });

    $("#resetSimulation").on("click", () => {
        resetSimulation();
    });
}
