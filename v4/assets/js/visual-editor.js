      const STORAGE_KEY = "v2VisualEditorState";
      const SNAPSHOTS_STORAGE_KEY = "v2VisualEditorSnapshots";
      let assetIdCounter = 1;
      let availableAssets = [];
      let savedBillboards = [];
      let draggingSavedSnapshotId = null;
      let activeSnapshotId = null;

      const assetsList = document.getElementById("assetsList");
      const saveBillboardButton = document.getElementById("saveBillboardButton");
      const previewModeToggle = document.getElementById("previewModeToggle");
      const previewModeFlatButton = document.getElementById("previewModeFlatButton");
      const previewMode3dButton = document.getElementById("previewMode3dButton");
      const savedBillboardsList = document.getElementById("savedBillboardsList");
      const savedToggleButton = document.getElementById("savedToggleButton");
      const assetsToggleButton = document.getElementById("assetsToggleButton");
      const newBillboardButton = document.getElementById("newBillboardButton");
      const alignmentSettings = document.getElementById("alignmentSettings");
      const marqueeToggle = document.getElementById("marqueeToggle");
      const partitionsToggle = document.getElementById("partitionsToggle");
      const partitionSettingsSelect = document.getElementById("partitionSettingsSelect");
      const partitionTabsRow = document.getElementById("partitionTabsRow");
      const partitionTabs = document.getElementById("partitionTabs");
      const marqueeSpeedRow = document.getElementById("marqueeSpeedRow");
      const marqueeDirectionRow = document.getElementById("marqueeDirectionRow");
      const billboardWidthControl = document.getElementById("billboardWidthControl");
      const billboardHeightControl = document.getElementById("billboardHeightControl");
      const billboardCurveToggle = document.getElementById("billboardCurveToggle");
      const billboardCurveWidthRow = document.getElementById("billboardCurveWidthRow");
      const billboardCurvePositionRow = document.getElementById("billboardCurvePositionRow");
      const billboardCurveWidthControl = document.getElementById("billboardCurveWidthControl");
      const billboardCurvePositionControl = document.getElementById("billboardCurvePositionControl");
      const marqueeSpeedControl = document.getElementById("marqueeSpeedControl");
      const marqueeDirectionControl = document.getElementById("marqueeDirectionControl");
      const orientationControl = document.getElementById("orientationControl");
      const editorStage = document.getElementById("editorStage");
      const singleEditorCanvas = document.getElementById("singleEditorCanvas");
      const partitionEditorGrid = document.getElementById("partitionEditorGrid");
      const partitionEditorLeft = document.getElementById("partitionEditorLeft");
      const partitionEditorCurve = document.getElementById("partitionEditorCurve");
      const partitionEditorRight = document.getElementById("partitionEditorRight");
      const partitionViewportFrameLeft = document.getElementById("partitionViewportFrameLeft");
      const partitionViewportFrameCurve = document.getElementById("partitionViewportFrameCurve");
      const partitionViewportFrameRight = document.getElementById("partitionViewportFrameRight");
      const partitionViewportTimerLeft = document.getElementById("partitionViewportTimerLeft");
      const partitionViewportTimerCurve = document.getElementById("partitionViewportTimerCurve");
      const partitionViewportTimerRight = document.getElementById("partitionViewportTimerRight");
      const visualEditorBlock = document.getElementById("visualEditorBlock");
      const billboardViewportFrame = document.getElementById("billboardViewportFrame");
      const billboardViewportTimer = document.getElementById("billboardViewportTimer");
      const flatBillboard = document.getElementById("flatBillboard");
      const flatBillboard3d = document.getElementById("flatBillboard3d");
      const flatBillboard3dCanvas = document.getElementById("flatBillboard3dCanvas");
      const flatBillboardTrack = document.getElementById("flatBillboardTrack");
      const flatBillboardPartitionLayers = document.getElementById("flatBillboardPartitionLayers");
      const flatBillboardSinglePartitionGuides = document.getElementById("flatBillboardSinglePartitionGuides");
      const flatAnnoTopLabel = document.getElementById("flatAnnoTopLabel");
      const flatAnnoRightLabel = document.getElementById("flatAnnoRightLabel");
      const flatAnnoMarkerStart = document.getElementById("flatAnnoMarkerStart");
      const flatAnnoMarkerEnd = document.getElementById("flatAnnoMarkerEnd");
      const flatAnnoLabel1820 = document.getElementById("flatAnnoLabel1820");
      const flatAnnoLabelCurve = document.getElementById("flatAnnoLabelCurve");
      const flatAnnoLabel2840 = document.getElementById("flatAnnoLabel2840");
      const paddingTBControl = document.getElementById("paddingTBControl");
      const paddingLRControl = document.getElementById("paddingLRControl");
      const showGuidesControl = document.getElementById("showGuidesControl");
      const preview3dShadowControl = document.getElementById("preview3dShadowControl");
      const preview3dShadowValue = document.getElementById("preview3dShadowValue");
      const preview3dGlareControl = document.getElementById("preview3dGlareControl");
      const preview3dGlareValue = document.getElementById("preview3dGlareValue");
      const preview3dYawControl = document.getElementById("preview3dYawControl");
      const preview3dYawValue = document.getElementById("preview3dYawValue");
      const preview3dPitchControl = document.getElementById("preview3dPitchControl");
      const preview3dPitchValue = document.getElementById("preview3dPitchValue");
      const preview3dPerspectiveControl = document.getElementById("preview3dPerspectiveControl");
      const preview3dPerspectiveValue = document.getElementById("preview3dPerspectiveValue");
      const preview3dZoomControl = document.getElementById("preview3dZoomControl");
      const preview3dZoomValue = document.getElementById("preview3dZoomValue");
      const preview3dTargetXControl = document.getElementById("preview3dTargetXControl");
      const preview3dTargetYControl = document.getElementById("preview3dTargetYControl");
      const preview3dTargetZControl = document.getElementById("preview3dTargetZControl");
      const preview3dAutoFitButton = document.getElementById("preview3dAutoFitButton");
      const preview3dResetButton = document.getElementById("preview3dResetButton");
      const assetGapControl = document.getElementById("assetGapControl");
      const backgroundColorControl = document.getElementById("backgroundColorControl");
      const assetColorControl = document.getElementById("assetColorControl");
      const assetScaleControls = document.getElementById("assetScaleControls");
      const assetScaleDownButton = document.getElementById("assetScaleDownButton");
      const assetScaleUpButton = document.getElementById("assetScaleUpButton");
      const assetScaleValue = document.getElementById("assetScaleValue");
      const assetRotateButton = document.getElementById("assetRotateButton");
      const svgSourceCache = new Map();
      const svgColorUrlCache = new Map();
      let draggingAssetId = null;
      let cropDragState = null;
      let marqueeAnimationRaf = null;
      let marqueeLastTimestamp = 0;
      let marqueeProgressPx = 0;
      let partitionMarqueeProgressPx = { left: 0, curve: 0, right: 0 };
      let marqueeCyclePx = 0;
      let partitionViewportUiLastUpdateMs = 0;
      const PARTITION_VIEWPORT_UI_INTERVAL_MS = 100;
      let marqueeTargetVisible = true;
      let marqueeVisibilityObserver = null;
      let previewMode = "flat";
      let preview3dRaf = null;
      let preview3dDragState = null;
      let preview3dDomSnapshotCanvas = null;
      let preview3dDomSnapshotPromise = null;
      let preview3dDomSnapshotQueued = false;
      let preview3dDomSnapshotLastMs = 0;
      let preview3dLastTextureUpdateMs = 0;
      let preview3dForceTextureUpdate = true;
      let preview3dAutoFitPending = true;
      let billboardViewportOffsetX = 0;
      let billboardViewportOffsetY = 0;
      let billboardMarqueeOffsetX = 0;
      let billboardMarqueeOffsetY = 0;
      let editorMarqueeOffsetX = 0;
      let editorMarqueeOffsetY = 0;
      let viewportFrameDragState = null;
      let pendingPartitionAsset = null;
      const PARTITION_KEYS = ["left", "curve", "right"];
      const DEFAULT_ARTBOARD_WIDTH = 5900;
      const DEFAULT_ARTBOARD_HEIGHT = 3480;
      const ARTBOARD_DIMENSION_MIN = 1;
      const ARTBOARD_DIMENSION_MAX = 30000;
      let artboardWidth = DEFAULT_ARTBOARD_WIDTH;
      let artboardHeight = DEFAULT_ARTBOARD_HEIGHT;
      let curveEnabled = true;
      let curveWidth = 1020;
      let curvePosition = 1820;
      const PREVIEW3D_CAMERA_DEFAULTS = {
        yaw: -0.7,
        pitch: 0.11,
        perspective: 1.33,
        zoom: 2.68,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
      };
      const PREVIEW3D_CAMERA = { ...PREVIEW3D_CAMERA_DEFAULTS };
      const PREVIEW3D_CAMERA_LIMITS = {
        pitchMin: -0.6,
        pitchMax: 1.4,
        perspectiveMin: 0.1,
        perspectiveMax: 2.5,
        zoomMin: 0.12,
        zoomMax: 4.8,
        targetXMin: -3500,
        targetXMax: 3500,
        targetYMin: -5000,
        targetYMax: 6000,
        targetZMin: -4500,
        targetZMax: 4500,
      };
      const PREVIEW3D_FX_DEFAULTS = {
        shadow: 0.35,
        glare: 0.25,
      };
      const PREVIEW3D_TEXTURE_HEIGHT = 960;
      const PREVIEW3D_DOM_SNAPSHOT_INTERVAL_MS = 180;
      const PREVIEW3D_USE_DOM_SNAPSHOT = false;
      const PREVIEW3D_TEXTURE_UPDATE_INTERVAL_MS = 80;
      const PREVIEW3D_RENDER_PIXEL_RATIO_MAX = 1.5;
      const preview3dThreeState = {
        renderer: null,
        scene: null,
        camera: null,
        mesh: null,
        texture: null,
        initFailed: false,
        renderCssWidth: 0,
        renderCssHeight: 0,
        ambientLight: null,
        keyLight: null,
        fillLight: null,
        material: null,
      };
      const preview3dSourceCanvas = document.createElement("canvas");
      const preview3dSourceCtx = preview3dSourceCanvas.getContext("2d");
      function partitionLayout(boardWidth = artboardWidth) {
        const normalizedBoardWidth = Math.max(1, Math.round(Number(boardWidth) || 1));
        const normalizedCurve = sanitizeCurveSettings(true, curveWidth, curvePosition, normalizedBoardWidth);
        const leftWidth = normalizedCurve.position;
        const curveSpan = normalizedCurve.width;
        const rightWidth = Math.max(0, normalizedBoardWidth - leftWidth - curveSpan);
        return {
          left: {
            offsetRatio: 0,
            widthRatio: leftWidth / normalizedBoardWidth,
          },
          curve: {
            offsetRatio: leftWidth / normalizedBoardWidth,
            widthRatio: curveSpan / normalizedBoardWidth,
          },
          right: {
            offsetRatio: (leftWidth + curveSpan) / normalizedBoardWidth,
            widthRatio: rightWidth / normalizedBoardWidth,
          },
        };
      }

      function normalizePreviewMode(value) {
        return String(value || "").toLowerCase() === "3d" ? "3d" : "flat";
      }

      function syncPreviewModeToggleStates() {
        if (!(previewModeToggle instanceof HTMLElement)) {
          return;
        }
        const buttons = previewModeToggle.querySelectorAll(".preview-mode-button");
        for (const button of buttons) {
          const value = normalizePreviewMode(button.dataset.value);
          const isActive = previewMode === value;
          button.classList.toggle("inactive", !isActive);
          button.setAttribute("aria-checked", isActive ? "true" : "false");
        }
      }

      function setPreviewMode(value, options = {}) {
        const normalized = normalizePreviewMode(value);
        const persist = options.persist !== false;
        previewMode = normalized;
        document.body.classList.toggle("preview-mode-3d", normalized === "3d");
        if (flatBillboard3d instanceof HTMLElement) {
          flatBillboard3d.setAttribute("aria-hidden", normalized === "3d" ? "false" : "true");
        }
        syncPreviewModeToggleStates();
        if (normalized === "3d") {
          preview3dAutoFitPending = true;
          queueFlatBillboardSnapshot(true);
          preview3dForceTextureUpdate = true;
          startPreview3dLoop();
        } else {
          clearPreview3dDragState();
          stopPreview3dLoop();
        }
        if (editorState && editorState.settings) {
          syncSettingsControlsFromState();
        }
        if (persist && editorState && editorState.settings) {
          editorState.settings.previewMode = normalized;
          saveEditorState();
        }
      }

      function normalizeArtboardDimension(value, fallback) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
          return fallback;
        }
        return Math.max(
          ARTBOARD_DIMENSION_MIN,
          Math.min(ARTBOARD_DIMENSION_MAX, Math.round(parsed))
        );
      }

      function sanitizeCurveSettings(enabledValue, widthValue, positionValue, boardWidth = artboardWidth) {
        const normalizedEnabled = enabledValue !== false;
        const maxSpan = Math.max(0, boardWidth);
        const normalizedPosition = Math.max(0, Math.min(maxSpan, Math.round(Number(positionValue) || 0)));
        const maxWidthFromPosition = Math.max(0, maxSpan - normalizedPosition);
        const normalizedWidth = Math.max(0, Math.min(maxWidthFromPosition, Math.round(Number(widthValue) || 0)));
        return {
          enabled: normalizedEnabled,
          width: normalizedWidth,
          position: normalizedPosition,
        };
      }

      function applyArtboardCssVariables() {
        document.documentElement.style.setProperty("--billboard-width", String(artboardWidth));
        document.documentElement.style.setProperty("--billboard-height", String(artboardHeight));
        if (flatAnnoTopLabel instanceof HTMLElement) {
          flatAnnoTopLabel.textContent = artboardWidth + "px width";
        }
        if (flatAnnoRightLabel instanceof HTMLElement) {
          flatAnnoRightLabel.textContent = artboardHeight + "px height";
        }
        syncCurveGuidelineDisplay();
      }

      function syncBillboardDimensionControls() {
        if (billboardWidthControl instanceof HTMLInputElement) {
          billboardWidthControl.value = String(artboardWidth);
        }
        if (billboardHeightControl instanceof HTMLInputElement) {
          billboardHeightControl.value = String(artboardHeight);
        }
      }

      function syncBillboardCurveControls() {
        if (billboardCurveWidthControl instanceof HTMLInputElement) {
          billboardCurveWidthControl.value = String(curveWidth);
          billboardCurveWidthControl.disabled = !curveEnabled;
          billboardCurveWidthControl.max = String(Math.max(0, artboardWidth - curvePosition));
        }
        if (billboardCurvePositionControl instanceof HTMLInputElement) {
          billboardCurvePositionControl.value = String(curvePosition);
          billboardCurvePositionControl.disabled = !curveEnabled;
          billboardCurvePositionControl.max = String(Math.max(0, artboardWidth));
        }
        if (billboardCurveWidthRow instanceof HTMLElement) {
          billboardCurveWidthRow.hidden = !curveEnabled;
        }
        if (billboardCurvePositionRow instanceof HTMLElement) {
          billboardCurvePositionRow.hidden = !curveEnabled;
        }
        if (billboardCurveToggle instanceof HTMLElement) {
          const buttons = billboardCurveToggle.querySelectorAll(".marquee-choice");
          for (const button of buttons) {
            const isOn = button.dataset.value === "on";
            const isSelected = curveEnabled ? isOn : !isOn;
            button.classList.toggle("inactive", !isSelected);
            button.setAttribute("aria-checked", isSelected ? "true" : "false");
          }
        }
      }

      function syncCurveGuidelineDisplay() {
        if (!(flatBillboard instanceof HTMLElement)) {
          return;
        }
        const curveStart = curvePosition;
        const curveEnd = curvePosition + curveWidth;
        const startRatio = artboardWidth > 0 ? curveStart / artboardWidth : 0;
        const endRatio = artboardWidth > 0 ? curveEnd / artboardWidth : 0;
        const midRatio = artboardWidth > 0 ? ((curveStart + curveEnd) * 0.5) / artboardWidth : 0;
        flatBillboard.style.setProperty("--curve-start-ratio", String(startRatio));
        flatBillboard.style.setProperty("--curve-end-ratio", String(endRatio));
        flatBillboard.style.setProperty("--curve-mid-ratio", String(midRatio));
        const showCurveGuides = curveEnabled && curveWidth > 0;
        if (flatAnnoMarkerStart instanceof HTMLElement) {
          flatAnnoMarkerStart.style.display = showCurveGuides ? "block" : "none";
        }
        if (flatAnnoMarkerEnd instanceof HTMLElement) {
          flatAnnoMarkerEnd.style.display = showCurveGuides ? "block" : "none";
        }
        if (flatAnnoLabel1820 instanceof HTMLElement) {
          flatAnnoLabel1820.textContent = curveStart + "px";
          flatAnnoLabel1820.style.display = showCurveGuides ? "block" : "none";
        }
        if (flatAnnoLabelCurve instanceof HTMLElement) {
          flatAnnoLabelCurve.textContent = curveWidth + "px curve";
          flatAnnoLabelCurve.style.display = showCurveGuides ? "block" : "none";
        }
        if (flatAnnoLabel2840 instanceof HTMLElement) {
          flatAnnoLabel2840.textContent = curveEnd + "px";
          flatAnnoLabel2840.style.display = showCurveGuides ? "block" : "none";
        }
      }

      function computePreview3dCurveSample(distanceAlongWidth) {
        const leftLength = curveEnabled ? curvePosition : artboardWidth;
        const curveLength = curveEnabled ? curveWidth : 0;
        const rightLength = Math.max(0, artboardWidth - leftLength - curveLength);
        const totalLength = artboardWidth;
        const s = Math.max(0, Math.min(totalLength, Number(distanceAlongWidth) || 0));
        if (!curveEnabled || curveLength <= 0) {
          return { x: s, depth: 0 };
        }
        const radius = curveLength / (Math.PI / 2);

        if (s <= leftLength) {
          return { x: s, depth: 0 };
        }
        if (s <= leftLength + curveLength) {
          const t = (s - leftLength) / curveLength;
          const theta = (Math.PI / 2) * (1 - t);
          return {
            x: leftLength + radius * Math.cos(theta),
            depth: -radius + radius * Math.sin(theta),
          };
        }
        const rightDistance = s - leftLength - curveLength;
        return {
          x: leftLength + radius,
          depth: -radius - Math.min(rightLength, rightDistance),
        };
      }

      function computePreview3dCurveCenter() {
        let minX = Infinity;
        let maxX = -Infinity;
        let minDepth = Infinity;
        let maxDepth = -Infinity;
        const sampleCount = 320;
        for (let i = 0; i <= sampleCount; i += 1) {
          const s = (i / sampleCount) * artboardWidth;
          const sample = computePreview3dCurveSample(s);
          minX = Math.min(minX, sample.x);
          maxX = Math.max(maxX, sample.x);
          minDepth = Math.min(minDepth, sample.depth);
          maxDepth = Math.max(maxDepth, sample.depth);
        }
        return {
          x: (minX + maxX) * 0.5,
          depth: (minDepth + maxDepth) * 0.5,
        };
      }

      function ensurePreview3dCanvasSize() {
        const canvas = preview3dCanvasElement();
        if (!(canvas instanceof HTMLCanvasElement)) {
          return { width: 0, height: 0 };
        }
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const cssWidth = Math.max(1, canvas.clientWidth || 1);
        const cssHeight = Math.max(1, canvas.clientHeight || 1);
        const width = Math.max(1, Math.round(cssWidth * dpr));
        const height = Math.max(1, Math.round(cssHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        return { width, height };
      }

      function getThreeLib() {
        return typeof window !== "undefined" ? window.THREE || null : null;
      }

      function preview3dCanvasElement() {
        if (
          preview3dThreeState.renderer &&
          preview3dThreeState.renderer.domElement instanceof HTMLCanvasElement
        ) {
          return preview3dThreeState.renderer.domElement;
        }
        return flatBillboard3dCanvas instanceof HTMLCanvasElement ? flatBillboard3dCanvas : null;
      }

      function getHtml2CanvasLib() {
        if (!PREVIEW3D_USE_DOM_SNAPSHOT) {
          return null;
        }
        if (typeof window === "undefined") {
          return null;
        }
        return typeof window.html2canvas === "function" ? window.html2canvas : null;
      }

      function queueFlatBillboardSnapshot(force = false) {
        if (!(flatBillboard instanceof HTMLElement)) {
          return;
        }
        const html2canvas = getHtml2CanvasLib();
        if (!html2canvas) {
          return;
        }
        const now = (typeof performance !== "undefined" && typeof performance.now === "function")
          ? performance.now()
          : Date.now();
        if (!force && now - preview3dDomSnapshotLastMs < PREVIEW3D_DOM_SNAPSHOT_INTERVAL_MS) {
          return;
        }
        if (preview3dDomSnapshotPromise) {
          preview3dDomSnapshotQueued = true;
          return;
        }
        preview3dDomSnapshotPromise = html2canvas(flatBillboard, {
          backgroundColor: null,
          scale: Math.min(2, Math.max(1, window.devicePixelRatio || 1)),
          logging: false,
          useCORS: true,
          allowTaint: true,
          removeContainer: true,
        })
          .then((canvas) => {
            if (canvas instanceof HTMLCanvasElement && isUsableFlatSnapshotCanvas(canvas)) {
              preview3dDomSnapshotCanvas = canvas;
              preview3dDomSnapshotLastMs = now;
            }
          })
          .catch(() => {
            // Keep manual fallback renderer active if DOM snapshot fails.
          })
          .finally(() => {
            preview3dDomSnapshotPromise = null;
            if (preview3dDomSnapshotQueued) {
              preview3dDomSnapshotQueued = false;
              queueFlatBillboardSnapshot(true);
            }
          });
      }

      function isUsableFlatSnapshotCanvas(canvas) {
        if (!(canvas instanceof HTMLCanvasElement)) {
          return false;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return false;
        }
        const width = Math.max(1, canvas.width || 1);
        const height = Math.max(1, canvas.height || 1);
        const sampleCols = 14;
        const sampleRows = 10;
        let nonBackground = 0;
        let total = 0;
        const expectedBg = editorState?.settings?.backgroundColor || "#ff00ff";
        const parseHex = (hex) => {
          const value = String(hex || "").trim();
          if (!/^#[0-9a-f]{6}$/i.test(value)) {
            return { r: 255, g: 0, b: 255 };
          }
          return {
            r: parseInt(value.slice(1, 3), 16),
            g: parseInt(value.slice(3, 5), 16),
            b: parseInt(value.slice(5, 7), 16),
          };
        };
        const bg = parseHex(expectedBg);
        const tolerance = 18;
        for (let row = 0; row < sampleRows; row += 1) {
          for (let col = 0; col < sampleCols; col += 1) {
            const x = Math.min(width - 1, Math.round((col + 0.5) / sampleCols * width));
            const y = Math.min(height - 1, Math.round((row + 0.5) / sampleRows * height));
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const dr = Math.abs(pixel[0] - bg.r);
            const dg = Math.abs(pixel[1] - bg.g);
            const db = Math.abs(pixel[2] - bg.b);
            const isBackground = dr <= tolerance && dg <= tolerance && db <= tolerance;
            if (!isBackground) {
              nonBackground += 1;
            }
            total += 1;
          }
        }
        if (total <= 0) {
          return false;
        }
        const contentRatio = nonBackground / total;
        // Reject obviously clipped snapshots (only tiny slivers captured).
        return contentRatio >= 0.08;
      }

      function normalizePreview3dYaw(value) {
        const yaw = Number(value);
        if (!Number.isFinite(yaw)) {
          return PREVIEW3D_CAMERA_DEFAULTS.yaw;
        }
        const turn = Math.PI * 2;
        return ((yaw + Math.PI) % turn + turn) % turn - Math.PI;
      }

      function sanitizePreview3dCameraSettings(source) {
        const input = source && typeof source === "object" ? source : {};
        const pick = (key, fallback) => {
          const parsed = Number(input[key]);
          return Number.isFinite(parsed) ? parsed : fallback;
        };
        return {
          yaw: normalizePreview3dYaw(pick("yaw", PREVIEW3D_CAMERA_DEFAULTS.yaw)),
          pitch: Math.min(PREVIEW3D_CAMERA_LIMITS.pitchMax, Math.max(PREVIEW3D_CAMERA_LIMITS.pitchMin, pick("pitch", PREVIEW3D_CAMERA_DEFAULTS.pitch))),
          perspective: Math.min(
            PREVIEW3D_CAMERA_LIMITS.perspectiveMax,
            Math.max(PREVIEW3D_CAMERA_LIMITS.perspectiveMin, pick("perspective", PREVIEW3D_CAMERA_DEFAULTS.perspective))
          ),
          zoom: Math.min(PREVIEW3D_CAMERA_LIMITS.zoomMax, Math.max(PREVIEW3D_CAMERA_LIMITS.zoomMin, pick("zoom", PREVIEW3D_CAMERA_DEFAULTS.zoom))),
          targetX: Math.min(PREVIEW3D_CAMERA_LIMITS.targetXMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetXMin, pick("targetX", PREVIEW3D_CAMERA_DEFAULTS.targetX))),
          targetY: Math.min(PREVIEW3D_CAMERA_LIMITS.targetYMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetYMin, pick("targetY", PREVIEW3D_CAMERA_DEFAULTS.targetY))),
          targetZ: Math.min(PREVIEW3D_CAMERA_LIMITS.targetZMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetZMin, pick("targetZ", PREVIEW3D_CAMERA_DEFAULTS.targetZ))),
        };
      }

      function clampPreview3dCamera() {
        PREVIEW3D_CAMERA.yaw = normalizePreview3dYaw(PREVIEW3D_CAMERA.yaw);
        PREVIEW3D_CAMERA.pitch = Math.min(PREVIEW3D_CAMERA_LIMITS.pitchMax, Math.max(PREVIEW3D_CAMERA_LIMITS.pitchMin, PREVIEW3D_CAMERA.pitch));
        PREVIEW3D_CAMERA.perspective = Math.min(
          PREVIEW3D_CAMERA_LIMITS.perspectiveMax,
          Math.max(PREVIEW3D_CAMERA_LIMITS.perspectiveMin, PREVIEW3D_CAMERA.perspective)
        );
        PREVIEW3D_CAMERA.zoom = Math.min(PREVIEW3D_CAMERA_LIMITS.zoomMax, Math.max(PREVIEW3D_CAMERA_LIMITS.zoomMin, PREVIEW3D_CAMERA.zoom));
        PREVIEW3D_CAMERA.targetX = Math.min(PREVIEW3D_CAMERA_LIMITS.targetXMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetXMin, PREVIEW3D_CAMERA.targetX));
        PREVIEW3D_CAMERA.targetY = Math.min(PREVIEW3D_CAMERA_LIMITS.targetYMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetYMin, PREVIEW3D_CAMERA.targetY));
        PREVIEW3D_CAMERA.targetZ = Math.min(PREVIEW3D_CAMERA_LIMITS.targetZMax, Math.max(PREVIEW3D_CAMERA_LIMITS.targetZMin, PREVIEW3D_CAMERA.targetZ));
      }

      function requiredDistanceForPreview3dSphere(radius, aspect, perspectiveFactor) {
        const safeRadius = Math.max(1, Number(radius) || 1);
        const safeAspect = Math.max(0.01, Number(aspect) || 1);
        const safePerspective = Math.max(
          PREVIEW3D_CAMERA_LIMITS.perspectiveMin,
          Math.min(PREVIEW3D_CAMERA_LIMITS.perspectiveMax, Number(perspectiveFactor) || 1)
        );
        const fovDeg = Math.max(18, Math.min(72, 44 / safePerspective));
        const vHalf = (fovDeg * Math.PI / 180) * 0.5;
        const hHalf = Math.atan(Math.tan(vHalf) * safeAspect);
        const limitingHalf = Math.max(0.01, Math.min(vHalf, hHalf));
        const padding = 1.08;
        return (safeRadius * padding) / Math.sin(limitingHalf);
      }

      function autoFitPreview3dCameraToCanvas(options = {}) {
        const force = options.force === true;
        const persist = options.persist === true;
        if (!force && !preview3dAutoFitPending) {
          return false;
        }
        const camera = preview3dThreeState.camera;
        const mesh = preview3dThreeState.mesh;
        const canvas = preview3dCanvasElement();
        const THREE = getThreeLib();
        if (!camera || !mesh || !(canvas instanceof HTMLCanvasElement) || !THREE) {
          return false;
        }
        const cssWidth = Math.max(1, canvas.clientWidth || 1);
        const cssHeight = Math.max(1, canvas.clientHeight || 1);
        const aspect = cssWidth / cssHeight;
        const bounds = new THREE.Box3().setFromObject(mesh);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        if (!sphere || !Number.isFinite(sphere.radius) || sphere.radius <= 0) {
          return false;
        }
        const maxDistance = 2200 * PREVIEW3D_CAMERA_LIMITS.zoomMax;
        const minPerspective = PREVIEW3D_CAMERA_LIMITS.perspectiveMin;
        const maxPerspective = PREVIEW3D_CAMERA_LIMITS.perspectiveMax;
        let low = minPerspective;
        let high = maxPerspective;
        for (let i = 0; i < 22; i += 1) {
          const mid = (low + high) * 0.5;
          const requiredDistance = requiredDistanceForPreview3dSphere(sphere.radius, aspect, mid);
          if (requiredDistance <= maxDistance) {
            low = mid;
          } else {
            high = mid;
          }
        }
        const chosenPerspective = Math.max(minPerspective, Math.min(maxPerspective, low));
        const fitDistance = requiredDistanceForPreview3dSphere(sphere.radius, aspect, chosenPerspective);
        PREVIEW3D_CAMERA.perspective = chosenPerspective;
        PREVIEW3D_CAMERA.zoom = fitDistance / 2200;
        PREVIEW3D_CAMERA.targetX = sphere.center.x;
        PREVIEW3D_CAMERA.targetY = sphere.center.y;
        PREVIEW3D_CAMERA.targetZ = sphere.center.z;
        clampPreview3dCamera();
        preview3dAutoFitPending = false;
        syncPreview3dCameraStateFromRuntime();
        syncPreview3dCameraControls();
        if (persist) {
          saveEditorState();
        }
        return true;
      }

      function createCurvedBillboardGeometry(THREE) {
        const widthSegments = 120;
        const geometry = new THREE.PlaneGeometry(artboardWidth, artboardHeight, widthSegments, 1);
        const curveCenter = computePreview3dCurveCenter();
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i += 1) {
          const originalX = positions.getX(i);
          const distanceAlongWidth = originalX + artboardWidth * 0.5;
          const sample = computePreview3dCurveSample(distanceAlongWidth);
          positions.setX(i, sample.x - curveCenter.x);
          positions.setZ(i, sample.depth - curveCenter.depth);
        }
        positions.needsUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        return geometry;
      }

      function ensureThreePreviewSetup() {
        if (!(flatBillboard3d instanceof HTMLElement)) {
          return false;
        }
        const THREE = getThreeLib();
        if (!THREE || preview3dThreeState.initFailed) {
          return false;
        }
        if (
          preview3dThreeState.renderer &&
          preview3dThreeState.scene &&
          preview3dThreeState.camera &&
          preview3dThreeState.mesh
        ) {
          return true;
        }

        let renderer = null;
        try {
          // Always let Three create/manage its own canvas to avoid
          // mixed 2D/WebGL context collisions on pre-existing nodes.
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          });
        } catch (error) {
          preview3dThreeState.initFailed = true;
          return false;
        }
        if (!(renderer && renderer.domElement instanceof HTMLCanvasElement)) {
          preview3dThreeState.initFailed = true;
          return false;
        }
        if (flatBillboard3d.contains(renderer.domElement) === false) {
          renderer.domElement.id = "flatBillboard3dCanvas";
          renderer.domElement.className = "flat-billboard-3d-canvas";
          flatBillboard3d.replaceChildren(renderer.domElement);
        }
        renderer.setPixelRatio(Math.min(PREVIEW3D_RENDER_PIXEL_RATIO_MAX, Math.max(1, window.devicePixelRatio || 1)));
        renderer.setClearColor(0xffffff, 1);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
        keyLight.position.set(2200, 3200, 2800);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xb7c3ff, 0.22);
        fillLight.position.set(-1800, 1200, 900);
        scene.add(fillLight);

        const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 30000);
        const geometry = createCurvedBillboardGeometry(THREE);
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.48,
          metalness: 0.06,
          emissive: 0xffffff,
          emissiveIntensity: 0.92,
          side: THREE.FrontSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        // Orient the curved screen so its front face matches default camera view.
        mesh.rotation.y = Math.PI;
        scene.add(mesh);

        preview3dThreeState.renderer = renderer;
        preview3dThreeState.scene = scene;
        preview3dThreeState.camera = camera;
        preview3dThreeState.mesh = mesh;
        preview3dThreeState.ambientLight = ambientLight;
        preview3dThreeState.keyLight = keyLight;
        preview3dThreeState.fillLight = fillLight;
        preview3dThreeState.material = material;
        return true;
      }

      function applyPreview3dFxToScene() {
        const ambientLight = preview3dThreeState.ambientLight;
        const keyLight = preview3dThreeState.keyLight;
        const fillLight = preview3dThreeState.fillLight;
        const material = preview3dThreeState.material;
        if (!ambientLight || !keyLight || !fillLight || !material) {
          return;
        }
        const shadow = Math.max(0, Math.min(1, Number(editorState?.settings?.preview3dShadow) || PREVIEW3D_FX_DEFAULTS.shadow));
        const glare = Math.max(0, Math.min(1, Number(editorState?.settings?.preview3dGlare) || PREVIEW3D_FX_DEFAULTS.glare));
        ambientLight.intensity = Math.max(0.15, 1.0 - shadow * 0.45);
        keyLight.intensity = 0.75 + glare * 0.5 + shadow * 0.1;
        fillLight.intensity = Math.max(0.05, 0.18 + glare * 0.3 - shadow * 0.12);
        material.roughness = Math.max(0.05, Math.min(0.95, 0.72 - glare * 0.52 + shadow * 0.18));
        material.metalness = Math.max(0, Math.min(0.45, 0.03 + glare * 0.24));
        material.emissiveIntensity = Math.max(0, Math.min(2, 0.78 + glare * 0.42 - shadow * 0.24));
      }

      function syncThreeTextureFromFlatSource() {
        const THREE = getThreeLib();
        const mesh = preview3dThreeState.mesh;
        if (!THREE || !mesh || !mesh.material) {
          return false;
        }
        const textureHeight = Math.max(640, PREVIEW3D_TEXTURE_HEIGHT);
        const textureWidth = Math.max(1, Math.round(textureHeight * artboardWidth / artboardHeight));
        if (!drawFlatBillboardSourceCanvas(textureWidth, textureHeight)) {
          return false;
        }
        if (!(preview3dThreeState.texture instanceof THREE.Texture)) {
          const texture = new THREE.CanvasTexture(preview3dSourceCanvas);
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.flipY = true;
          texture.center.set(0, 0);
          texture.rotation = 0;
          texture.repeat.set(1, 1);
          texture.offset.set(0, 0);
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          if ("colorSpace" in texture && "SRGBColorSpace" in THREE) {
            texture.colorSpace = THREE.SRGBColorSpace;
          }
          texture.needsUpdate = true;
          preview3dThreeState.texture = texture;
          mesh.material.map = texture;
          if ("emissiveMap" in mesh.material) {
            mesh.material.emissiveMap = texture;
          }
          mesh.material.needsUpdate = true;
        } else {
          preview3dThreeState.texture.flipY = true;
          preview3dThreeState.texture.wrapS = THREE.ClampToEdgeWrapping;
          preview3dThreeState.texture.wrapT = THREE.ClampToEdgeWrapping;
          preview3dThreeState.texture.center.set(0, 0);
          preview3dThreeState.texture.rotation = 0;
          preview3dThreeState.texture.repeat.set(1, 1);
          preview3dThreeState.texture.offset.set(0, 0);
          preview3dThreeState.texture.needsUpdate = true;
        }
        return true;
      }

      function syncThreeCameraTransform() {
        const camera = preview3dThreeState.camera;
        if (!camera) {
          return;
        }
        const perspectiveFactor = Math.min(2.5, Math.max(0.1, PREVIEW3D_CAMERA.perspective));
        camera.fov = Math.max(18, Math.min(72, 44 / perspectiveFactor));
        const radius = 2200 * PREVIEW3D_CAMERA.zoom;
        const yaw = PREVIEW3D_CAMERA.yaw;
        const pitch = PREVIEW3D_CAMERA.pitch;
        const cosPitch = Math.cos(pitch);
        camera.position.set(
          Math.sin(yaw) * cosPitch * radius,
          Math.sin(pitch) * radius * 0.9,
          Math.cos(yaw) * cosPitch * radius
        );
        camera.lookAt(PREVIEW3D_CAMERA.targetX, PREVIEW3D_CAMERA.targetY, PREVIEW3D_CAMERA.targetZ);
      }

      function clearPreview3dDragState() {
        preview3dDragState = null;
        const canvas = preview3dCanvasElement();
        if (canvas instanceof HTMLCanvasElement) {
          canvas.style.cursor = "grab";
        }
        if (flatBillboard3d instanceof HTMLElement) {
          flatBillboard3d.style.cursor = "grab";
        }
      }

      function applyPreview3dDrag(clientX, clientY) {
        const canvas = preview3dCanvasElement();
        if (!preview3dDragState || !(canvas instanceof HTMLCanvasElement)) {
          return;
        }
        const dx = clientX - preview3dDragState.lastX;
        const dy = clientY - preview3dDragState.lastY;
        preview3dDragState.lastX = clientX;
        preview3dDragState.lastY = clientY;

        if (preview3dDragState.dragMode === "pan") {
          const canvasHeight = Math.max(1, canvas.clientHeight || 1);
          const perspectiveFactor = Math.min(2.5, Math.max(0.1, PREVIEW3D_CAMERA.perspective));
          const radius = (4200 * PREVIEW3D_CAMERA.zoom) / perspectiveFactor;
          const panScale = (radius / canvasHeight) * 2.2;
          PREVIEW3D_CAMERA.targetX -= dx * panScale;
          PREVIEW3D_CAMERA.targetY += dy * panScale;
        } else {
          PREVIEW3D_CAMERA.yaw += dx * 0.005;
          PREVIEW3D_CAMERA.pitch -= dy * 0.004;
        }

        preview3dAutoFitPending = false;
        clampPreview3dCamera();
        syncPreview3dCameraStateFromRuntime();
        syncPreview3dCameraControls();
        if (previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
      }

      function setupPreview3dCanvasInteraction() {
        if (!(flatBillboard3d instanceof HTMLElement)) {
          return;
        }
        flatBillboard3d.style.cursor = "grab";
        flatBillboard3d.addEventListener("contextmenu", (event) => {
          event.preventDefault();
        });
        flatBillboard3d.addEventListener("pointerdown", (event) => {
          if (event.button !== 0) {
            return;
          }
          if (previewMode !== "3d") {
            return;
          }
          const dragMode = event.shiftKey ? "pan" : "orbit";
          preview3dDragState = {
            lastX: event.clientX,
            lastY: event.clientY,
            dragMode,
          };
          flatBillboard3d.style.cursor = "grabbing";
          const currentCanvas = preview3dCanvasElement();
          if (currentCanvas instanceof HTMLCanvasElement) {
            currentCanvas.style.cursor = "grabbing";
          }
          try {
            const targetCanvas = event.target instanceof HTMLCanvasElement ? event.target : currentCanvas;
            if (targetCanvas instanceof HTMLCanvasElement) {
              targetCanvas.setPointerCapture(event.pointerId);
            }
          } catch (error) {
            // Ignore pointer capture failures.
          }
          event.preventDefault();
        });
        flatBillboard3d.addEventListener("pointermove", (event) => {
          if (!preview3dDragState) {
            return;
          }
          applyPreview3dDrag(event.clientX, event.clientY);
        });
        flatBillboard3d.addEventListener("pointerup", () => {
          clearPreview3dDragState();
        });
        flatBillboard3d.addEventListener("pointercancel", () => {
          clearPreview3dDragState();
        });
        flatBillboard3d.addEventListener("pointerleave", () => {
          clearPreview3dDragState();
        });
        flatBillboard3d.addEventListener(
          "wheel",
          (event) => {
            if (previewMode !== "3d") {
              return;
            }
            const delta = Number(event.deltaY) || 0;
            if (!delta) {
              return;
            }
            const factor = Math.exp(delta * 0.0012);
            PREVIEW3D_CAMERA.zoom *= factor;
            preview3dAutoFitPending = false;
            clampPreview3dCamera();
            syncPreview3dCameraStateFromRuntime();
            syncPreview3dCameraControls();
            drawCurvedBillboard3dFrame();
            event.preventDefault();
          },
          { passive: false }
        );
      }

      function drawFlatBillboardSourceCanvas(targetWidth, targetHeight) {
        if (!(flatBillboard instanceof HTMLElement) || !preview3dSourceCtx) {
          return false;
        }
        const width = Math.max(1, Math.round(targetWidth));
        const height = Math.max(1, Math.round(targetHeight));
        if (preview3dSourceCanvas.width !== width || preview3dSourceCanvas.height !== height) {
          preview3dSourceCanvas.width = width;
          preview3dSourceCanvas.height = height;
        }
        const sourceCtx = preview3dSourceCtx;
        sourceCtx.setTransform(1, 0, 0, 1, 0, 0);
        sourceCtx.clearRect(0, 0, width, height);
        sourceCtx.imageSmoothingEnabled = true;
        sourceCtx.imageSmoothingQuality = "high";
        const html2canvas = getHtml2CanvasLib();
        if (html2canvas) {
          queueFlatBillboardSnapshot();
          if (preview3dDomSnapshotCanvas instanceof HTMLCanvasElement) {
            sourceCtx.drawImage(preview3dDomSnapshotCanvas, 0, 0, width, height);
            return true;
          }
        }

        const computed = window.getComputedStyle(flatBillboard);
        sourceCtx.fillStyle = computed.backgroundColor || editorState.settings.backgroundColor || "#ff00ff";
        sourceCtx.fillRect(0, 0, width, height);

        const boardRect = flatBillboard.getBoundingClientRect();
        const boardWidth = Math.max(1, boardRect.width);
        const boardHeight = Math.max(1, boardRect.height);
        const sx = width / boardWidth;
        const sy = height / boardHeight;
        const parseRotateDeg = (transformValue) => {
          const value = String(transformValue || "");
          const match = value.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/i);
          if (!match) {
            return 0;
          }
          const parsed = Number(match[1]);
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const parseTranslateXPx = (transformValue) => {
          const value = String(transformValue || "");
          const match = value.match(/translateX\((-?\d+(?:\.\d+)?)px\)/i);
          if (!match) {
            return 0;
          }
          const parsed = Number(match[1]);
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const assets = flatBillboard.querySelectorAll(".flat-billboard-asset");
        for (const asset of assets) {
          if (!(asset instanceof HTMLElement)) {
            continue;
          }
          const rect = asset.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) {
            continue;
          }
          const x = (rect.left - boardRect.left) * sx;
          const y = (rect.top - boardRect.top) * sy;
          const w = rect.width * sx;
          const h = rect.height * sy;
          if (x + w < 0 || y + h < 0 || x > width || y > height) {
            continue;
          }
          const image = asset.querySelector(".flat-billboard-asset-image");
          const frame = asset.querySelector(".flat-billboard-asset-frame");
          if (
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0 &&
            frame instanceof HTMLElement
          ) {
            const centerX = x + w * 0.5;
            const centerY = y + h * 0.5;
            const frameWidthCss = parseFloat(frame.style.width || String(rect.width));
            const frameHeightCss = parseFloat(frame.style.height || String(rect.height));
            const imageWidthCss = parseFloat(image.style.width || String(rect.width));
            const imageHeightCss = parseFloat(image.style.height || String(rect.height));
            const rotateDeg = parseRotateDeg(frame.style.transform);
            const imageOffsetXCss = parseTranslateXPx(image.style.transform);
            const frameWidth = Math.max(1, frameWidthCss * sx);
            const frameHeight = Math.max(1, frameHeightCss * sy);
            const imageWidth = Math.max(1, imageWidthCss * sx);
            const imageHeight = Math.max(1, imageHeightCss * sy);
            const imageOffsetX = imageOffsetXCss * sx;

            sourceCtx.save();
            sourceCtx.translate(centerX, centerY);
            sourceCtx.rotate((rotateDeg * Math.PI) / 180);
            sourceCtx.beginPath();
            sourceCtx.rect(-frameWidth * 0.5, -frameHeight * 0.5, frameWidth, frameHeight);
            sourceCtx.clip();
            sourceCtx.drawImage(
              image,
              -imageWidth * 0.5 + imageOffsetX,
              -imageHeight * 0.5,
              imageWidth,
              imageHeight
            );
            sourceCtx.restore();
            continue;
          }
          const fill = window.getComputedStyle(asset).backgroundColor;
          sourceCtx.fillStyle = fill && fill !== "rgba(0, 0, 0, 0)" ? fill : (editorState.settings.assetColor || "#1e6cff");
          sourceCtx.fillRect(x, y, w, h);
        }
        return true;
      }

      function drawCurvedBillboard3dFrame() {
        if (previewMode !== "3d" || !ensureThreePreviewSetup()) {
          return;
        }
        const renderer = preview3dThreeState.renderer;
        const scene = preview3dThreeState.scene;
        const camera = preview3dThreeState.camera;
        const canvas = preview3dCanvasElement();
        if (!renderer || !scene || !camera || !(canvas instanceof HTMLCanvasElement)) {
          return;
        }
        const { width, height } = ensurePreview3dCanvasSize();
        if (!width || !height) {
          return;
        }
        const cssWidth = Math.max(1, canvas.clientWidth || 1);
        const cssHeight = Math.max(1, canvas.clientHeight || 1);
        if (
          preview3dThreeState.renderCssWidth !== cssWidth ||
          preview3dThreeState.renderCssHeight !== cssHeight
        ) {
          renderer.setSize(cssWidth, cssHeight, false);
          preview3dThreeState.renderCssWidth = cssWidth;
          preview3dThreeState.renderCssHeight = cssHeight;
          preview3dAutoFitPending = true;
        }
        camera.aspect = cssWidth / cssHeight;
        autoFitPreview3dCameraToCanvas();
        syncThreeCameraTransform();
        applyPreview3dFxToScene();
        camera.updateProjectionMatrix();
        const now = (typeof performance !== "undefined" && typeof performance.now === "function")
          ? performance.now()
          : Date.now();
        const marqueeActive = isMarqueeEnabledForCurrentMode();
        const textureIntervalMs = marqueeActive ? 33 : PREVIEW3D_TEXTURE_UPDATE_INTERVAL_MS;
        const shouldUpdateTexture = preview3dForceTextureUpdate
          || (now - preview3dLastTextureUpdateMs >= textureIntervalMs);
        if (shouldUpdateTexture) {
          const didUpdateTexture = syncThreeTextureFromFlatSource();
          if (didUpdateTexture) {
            preview3dLastTextureUpdateMs = now;
            preview3dForceTextureUpdate = false;
          }
        }
        renderer.render(scene, camera);
      }

      function tickPreview3d() {
        if (previewMode !== "3d") {
          preview3dRaf = null;
          return;
        }
        drawCurvedBillboard3dFrame();
        preview3dRaf = window.requestAnimationFrame(tickPreview3d);
      }

      function startPreview3dLoop() {
        if (preview3dRaf !== null) {
          return;
        }
        drawCurvedBillboard3dFrame();
        preview3dRaf = window.requestAnimationFrame(tickPreview3d);
      }

      function stopPreview3dLoop() {
        if (preview3dRaf !== null) {
          window.cancelAnimationFrame(preview3dRaf);
          preview3dRaf = null;
        }
      }

      function isVerticalOrientation() {
        return editorState?.settings?.orientation === "vertical";
      }

      function defaultPartitionSettings() {
        return {
          verticalAlignment: "top",
          orientation: "horizontal",
          marqueeEnabled: false,
          marqueeSpeed: 80,
          marqueeDirection: "rtl",
          paddingTB: 0,
          paddingLR: 0,
          assetGap: 8,
          backgroundColor: "#ff00ff",
          assetColor: "#1e6cff",
        };
      }
      const alignmentMap = {
        top: "flex-start",
        center: "center",
        bottom: "flex-end",
      };

      function resolveToolBasePathname() {
        const pathname = window.location.pathname || "/";
        if (pathname.endsWith("/index.html")) {
          return pathname;
        }
        return pathname.endsWith("/") ? pathname + "index.html" : pathname + "/index.html";
      }

      function resolveAppBasePathname() {
        const pathname = window.location.pathname || "/";
        const match = pathname.match(/^(.*)\/v3(?:\/index\.html|\/)?$/i);
        if (match) {
          const prefix = match[1] || "";
          return (prefix + "/v2/").replace(/\/{2,}/g, "/");
        }
        const fallbackToolUrl = new URL(resolveToolBasePathname(), window.location.origin);
        return new URL("../v2/", fallbackToolUrl).pathname;
      }

      const TOOL_BASE_PATHNAME = resolveToolBasePathname();
      const TOOL_BASE_URL = new URL(TOOL_BASE_PATHNAME, window.location.origin).toString();
      const APP_BASE_URL = new URL(resolveAppBasePathname(), window.location.origin).toString();

      function apiPath(path) {
        const cleanPath = String(path || "").replace(/^\/+/, "");
        return new URL(cleanPath, APP_BASE_URL).toString();
      }

      function snapshotSlugify(value) {
        return String(value || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      function snapshotSlugForEntry(snapshot) {
        const nameBase = snapshotSlugify(snapshot && snapshot.name ? snapshot.name : "snapshot");
        const base = nameBase || "snapshot";
        const idSuffix = snapshotSlugify(snapshot && snapshot.id ? snapshot.id : "").replace(/-/g, "").slice(-8);
        return idSuffix ? base + "-" + idSuffix : base;
      }

      function snapshotUrlForSlug(slug) {
        return TOOL_BASE_PATHNAME + "?snapshot=" + encodeURIComponent(slug);
      }

      function snapshotSlugFromLocationPath() {
        const query = new URLSearchParams(window.location.search || "");
        const querySlug = query.get("snapshot");
        if (querySlug) {
          return snapshotSlugify(querySlug);
        }
        const hash = String(window.location.hash || "");
        if (hash.startsWith("#snapshot=")) {
          return snapshotSlugify(hash.slice("#snapshot=".length));
        }
        const path = window.location.pathname || "";
        const base = TOOL_BASE_PATHNAME;
        const normalizedBase = base.endsWith("/") ? base : base + "/";
        if (!path.startsWith(normalizedBase)) {
          return "";
        }
        const remainder = path.slice(normalizedBase.length).replace(/^\/+/, "");
        if (!remainder) {
          return "";
        }
        const slug = remainder.split("/")[0];
        try {
          return snapshotSlugify(decodeURIComponent(slug));
        } catch (error) {
          return snapshotSlugify(slug);
        }
      }

      function findSavedBillboardBySlug(slug) {
        const normalizedSlug = snapshotSlugify(slug);
        if (!normalizedSlug) {
          return null;
        }
        return savedBillboards.find((entry) => snapshotSlugForEntry(entry) === normalizedSlug) || null;
      }

      function setPathForSnapshot(snapshot, replaceHistory) {
        if (!snapshot || typeof history === "undefined") {
          return;
        }
        const slug = snapshotSlugForEntry(snapshot);
        const nextUrl = snapshotUrlForSlug(slug);
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl === nextUrl) {
          return;
        }
        if (replaceHistory) {
          history.replaceState({ slug }, "", nextUrl);
        } else {
          history.pushState({ slug }, "", nextUrl);
        }
      }

      function setPathToToolRoot(replaceHistory) {
        if (typeof history === "undefined") {
          window.location.href = TOOL_BASE_URL;
          return;
        }
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl === TOOL_BASE_PATHNAME) {
          return;
        }
        if (replaceHistory) {
          history.replaceState({}, "", TOOL_BASE_PATHNAME);
        } else {
          history.pushState({}, "", TOOL_BASE_PATHNAME);
        }
      }

      function loadEditorState() {
        const defaultState = {
          assets: [],
          partitionAssets: {
            left: [],
            curve: [],
            right: [],
          },
          settings: {
            billboardWidth: DEFAULT_ARTBOARD_WIDTH,
            billboardHeight: DEFAULT_ARTBOARD_HEIGHT,
            billboardCurveEnabled: true,
            billboardCurveWidth: 1020,
            billboardCurvePosition: 1820,
            verticalAlignment: "top",
            previewMode: "flat",
            preview3dShadow: PREVIEW3D_FX_DEFAULTS.shadow,
            preview3dGlare: PREVIEW3D_FX_DEFAULTS.glare,
            preview3dCamera: { ...PREVIEW3D_CAMERA_DEFAULTS },
            partitionsEnabled: false,
            activePartitionKey: "left",
            partitionOrientations: {
              left: "horizontal",
              curve: "horizontal",
              right: "horizontal",
            },
            partitionSettings: {
              left: defaultPartitionSettings(),
              curve: defaultPartitionSettings(),
              right: defaultPartitionSettings(),
            },
            marqueeEnabled: false,
            marqueeSpeed: 80,
            marqueeDirection: "rtl",
            orientation: "horizontal",
            paddingTB: 0,
            paddingLR: 0,
            showGuides: true,
            assetGap: 8,
            backgroundColor: "#ff00ff",
            assetColor: "#1e6cff",
          },
        };
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) {
            return defaultState;
          }
          const parsed = JSON.parse(raw);
          const parsedAssets = Array.isArray(parsed.assets) ? parsed.assets : [];
          const parsedPartitionAssets = parsed && typeof parsed.partitionAssets === "object" && parsed.partitionAssets ? parsed.partitionAssets : {};
          const sanitizedAssets = parsedAssets
            .filter((asset) => asset && typeof asset === "object")
            .map((asset) => ({
              id: typeof asset.id === "string" ? asset.id : "asset-" + assetIdCounter++,
              name: typeof asset.name === "string" ? asset.name : "asset",
              src: typeof asset.src === "string" ? asset.src : "",
              group: typeof asset.group === "string" ? asset.group : "graphics",
              width: Number.isFinite(asset.width) ? asset.width : 100,
              height: Number.isFinite(asset.height) ? asset.height : 60,
              scalePercent: Number.isFinite(asset.scalePercent) ? asset.scalePercent : 100,
              rotationTurns: Number.isFinite(asset.rotationTurns) ? asset.rotationTurns : 0,
              cropLeft: Number.isFinite(asset.cropLeft) ? asset.cropLeft : 0,
              cropRight: Number.isFinite(asset.cropRight) ? asset.cropRight : 0,
            }))
            .filter((asset) => asset.width > 0 && asset.height > 0)
            .map((asset) => ({
              id: asset.id,
              name: asset.name,
              src: asset.src,
              group: asset.group === "animations" ? "animations" : "graphics",
              width: asset.width,
              height: asset.height,
              scalePercent: Math.max(10, Math.min(400, asset.scalePercent)),
              rotationTurns: ((Math.trunc(asset.rotationTurns) % 4) + 4) % 4,
              cropLeft: Math.max(0, Math.min(0.95, asset.cropLeft)),
              cropRight: Math.max(0, Math.min(0.95, asset.cropRight)),
            }));
          const sanitizeAssetList = (list) =>
            (Array.isArray(list) ? list : [])
              .filter((asset) => asset && typeof asset === "object")
              .map((asset) => ({
                id: typeof asset.id === "string" ? asset.id : "asset-" + assetIdCounter++,
                name: typeof asset.name === "string" ? asset.name : "asset",
                src: typeof asset.src === "string" ? asset.src : "",
                group: typeof asset.group === "string" ? asset.group : "graphics",
                width: Number.isFinite(asset.width) ? asset.width : 100,
                height: Number.isFinite(asset.height) ? asset.height : 60,
                scalePercent: Number.isFinite(asset.scalePercent) ? asset.scalePercent : 100,
                rotationTurns: Number.isFinite(asset.rotationTurns) ? asset.rotationTurns : 0,
                cropLeft: Number.isFinite(asset.cropLeft) ? asset.cropLeft : 0,
                cropRight: Number.isFinite(asset.cropRight) ? asset.cropRight : 0,
              }))
              .filter((asset) => asset.width > 0 && asset.height > 0)
              .map((asset) => ({
                id: asset.id,
                name: asset.name,
                src: asset.src,
                group: asset.group === "animations" ? "animations" : "graphics",
                width: asset.width,
                height: asset.height,
                scalePercent: Math.max(10, Math.min(400, asset.scalePercent)),
                rotationTurns: ((Math.trunc(asset.rotationTurns) % 4) + 4) % 4,
                cropLeft: Math.max(0, Math.min(0.95, asset.cropLeft)),
                cropRight: Math.max(0, Math.min(0.95, asset.cropRight)),
              }));
          const sanitizedPartitionAssets = {
            left: sanitizeAssetList(parsedPartitionAssets.left),
            curve: sanitizeAssetList(parsedPartitionAssets.curve),
            right: sanitizeAssetList(parsedPartitionAssets.right),
          };
          const savedAlignment = parsed?.settings?.verticalAlignment;
          const verticalAlignment = alignmentMap[savedAlignment] ? savedAlignment : "top";
          const previewMode = normalizePreviewMode(parsed?.settings?.previewMode);
          const savedPreview3dShadow = Number(parsed?.settings?.preview3dShadow);
          const preview3dShadow = Number.isFinite(savedPreview3dShadow)
            ? Math.max(0, Math.min(1, savedPreview3dShadow))
            : PREVIEW3D_FX_DEFAULTS.shadow;
          const savedPreview3dGlare = Number(parsed?.settings?.preview3dGlare);
          const preview3dGlare = Number.isFinite(savedPreview3dGlare)
            ? Math.max(0, Math.min(1, savedPreview3dGlare))
            : PREVIEW3D_FX_DEFAULTS.glare;
          const preview3dCamera = sanitizePreview3dCameraSettings(parsed?.settings?.preview3dCamera);
          const partitionsEnabled = !!parsed?.settings?.partitionsEnabled;
          const activePartitionKeyRaw = String(parsed?.settings?.activePartitionKey || "left");
          const activePartitionKey = PARTITION_KEYS.includes(activePartitionKeyRaw) ? activePartitionKeyRaw : "left";
          const savedPartitionOrientations = parsed?.settings?.partitionOrientations && typeof parsed.settings.partitionOrientations === "object"
            ? parsed.settings.partitionOrientations
            : {};
          const savedPartitionSettings = parsed?.settings?.partitionSettings && typeof parsed.settings.partitionSettings === "object"
            ? parsed.settings.partitionSettings
            : {};
          const savedMarqueeEnabled = !!parsed?.settings?.marqueeEnabled;
          const savedMarqueeSpeed = Number(parsed?.settings?.marqueeSpeed);
          const savedMarqueeDirection = String(parsed?.settings?.marqueeDirection || "rtl").toLowerCase();
          const marqueeDirection = savedMarqueeDirection === "ltr" ? "ltr" : "rtl";
          const marqueeSpeed = Number.isFinite(savedMarqueeSpeed) ? Math.max(5, Math.min(600, savedMarqueeSpeed)) : 80;
          const sanitizePartitionSettingsEntry = (entry, partitionKey) => {
            const fallback = defaultPartitionSettings();
            const src = entry && typeof entry === "object" ? entry : {};
            const alignment = alignmentMap[src.verticalAlignment] ? src.verticalAlignment : fallback.verticalAlignment;
            const savedOrientation = savedPartitionOrientations[partitionKey] === "vertical" ? "vertical" : "horizontal";
            const orientation = src.orientation === "vertical" || src.orientation === "horizontal"
              ? src.orientation
              : savedOrientation;
            const paddingTBValue = Number(src.paddingTB);
            const paddingLRValue = Number(src.paddingLR);
            const gapValue = Number(src.assetGap);
            const bg = typeof src.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(src.backgroundColor)
              ? src.backgroundColor
              : fallback.backgroundColor;
            const assetColor = typeof src.assetColor === "string" && /^#[0-9a-f]{6}$/i.test(src.assetColor)
              ? src.assetColor
              : fallback.assetColor;
            const marqueeEnabled = typeof src.marqueeEnabled === "boolean" ? src.marqueeEnabled : savedMarqueeEnabled;
            const srcMarqueeSpeed = Number(src.marqueeSpeed);
            const normalizedMarqueeSpeed = Number.isFinite(srcMarqueeSpeed)
              ? Math.max(5, Math.min(600, srcMarqueeSpeed))
              : marqueeSpeed;
            const srcMarqueeDirection = String(src.marqueeDirection || marqueeDirection).toLowerCase();
            const normalizedMarqueeDirection = srcMarqueeDirection === "ltr" ? "ltr" : "rtl";
            return {
              verticalAlignment: alignment,
              orientation,
              marqueeEnabled,
              marqueeSpeed: normalizedMarqueeSpeed,
              marqueeDirection: normalizedMarqueeDirection,
              paddingTB: Number.isFinite(paddingTBValue) ? Math.max(0, paddingTBValue) : fallback.paddingTB,
              paddingLR: Number.isFinite(paddingLRValue) ? Math.max(0, paddingLRValue) : fallback.paddingLR,
              assetGap: Number.isFinite(gapValue) ? Math.max(0, gapValue) : fallback.assetGap,
              backgroundColor: bg,
              assetColor,
            };
          };
          const partitionSettings = {
            left: sanitizePartitionSettingsEntry(savedPartitionSettings.left, "left"),
            curve: sanitizePartitionSettingsEntry(savedPartitionSettings.curve, "curve"),
            right: sanitizePartitionSettingsEntry(savedPartitionSettings.right, "right"),
          };
          const partitionOrientations = {
            left: partitionSettings.left.orientation,
            curve: partitionSettings.curve.orientation,
            right: partitionSettings.right.orientation,
          };
          const savedOrientation = String(parsed?.settings?.orientation || "horizontal").toLowerCase();
          const orientation = savedOrientation === "vertical" ? "vertical" : "horizontal";
          const savedBillboardWidth = Number(parsed?.settings?.billboardWidth);
          const savedBillboardHeight = Number(parsed?.settings?.billboardHeight);
          const billboardWidth = normalizeArtboardDimension(savedBillboardWidth, DEFAULT_ARTBOARD_WIDTH);
          const billboardHeight = normalizeArtboardDimension(savedBillboardHeight, DEFAULT_ARTBOARD_HEIGHT);
          const normalizedCurveSettings = sanitizeCurveSettings(
            parsed?.settings?.billboardCurveEnabled !== false,
            parsed?.settings?.billboardCurveWidth,
            parsed?.settings?.billboardCurvePosition,
            billboardWidth
          );
          const savedPaddingTB = Number(parsed?.settings?.paddingTB);
          const savedPaddingLR = Number(parsed?.settings?.paddingLR);
          const savedShowGuides = parsed?.settings?.showGuides;
          const savedAssetGap = Number(parsed?.settings?.assetGap);
          const paddingTB = Number.isFinite(savedPaddingTB) ? Math.max(0, savedPaddingTB) : 0;
          const paddingLR = Number.isFinite(savedPaddingLR) ? Math.max(0, savedPaddingLR) : 0;
          const showGuides = typeof savedShowGuides === "boolean" ? savedShowGuides : true;
          const assetGap = Number.isFinite(savedAssetGap) ? Math.max(0, savedAssetGap) : 8;
          const savedBackgroundColor = typeof parsed?.settings?.backgroundColor === "string" ? parsed.settings.backgroundColor : "#ff00ff";
          const savedAssetColor = typeof parsed?.settings?.assetColor === "string" ? parsed.settings.assetColor : "#1e6cff";
          return {
            assets: sanitizedAssets,
            partitionAssets: sanitizedPartitionAssets,
            settings: {
              billboardWidth,
              billboardHeight,
              billboardCurveEnabled: normalizedCurveSettings.enabled,
              billboardCurveWidth: normalizedCurveSettings.width,
              billboardCurvePosition: normalizedCurveSettings.position,
              verticalAlignment,
              previewMode,
              preview3dShadow,
              preview3dGlare,
              preview3dCamera,
              partitionsEnabled,
              activePartitionKey,
              partitionOrientations,
              partitionSettings,
              marqueeEnabled: savedMarqueeEnabled,
              marqueeSpeed,
              marqueeDirection,
              orientation,
              paddingTB,
              paddingLR,
              showGuides,
              assetGap,
              backgroundColor: savedBackgroundColor,
              assetColor: savedAssetColor,
            },
          };
        } catch (error) {
          return defaultState;
        }
      }

      function saveEditorState() {
        if (activeSnapshotId) {
          return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(editorState));
      }

      function cloneJsonValue(value) {
        return JSON.parse(JSON.stringify(value));
      }

      function formatSnapshotTimestamp(date) {
        const dt = date instanceof Date ? date : new Date();
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        const hours = String(dt.getHours()).padStart(2, "0");
        const minutes = String(dt.getMinutes()).padStart(2, "0");
        const seconds = String(dt.getSeconds()).padStart(2, "0");
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      }

      function loadSavedBillboards() {
        try {
          const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
          if (!raw) {
            return [];
          }
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            return [];
          }
          const normalized = parsed
            .filter((entry) => entry && typeof entry === "object")
            .map((entry) => ({
              id: typeof entry.id === "string" ? entry.id : "",
              name: typeof entry.name === "string" ? entry.name : "",
              createdAt: typeof entry.createdAt === "string" ? entry.createdAt : "",
              state: entry.state && typeof entry.state === "object" ? entry.state : null,
              runtime: entry.runtime && typeof entry.runtime === "object" ? entry.runtime : {},
            }))
            .filter((entry) => !!entry.id && !!entry.state);
          return normalized;
        } catch (error) {
          return [];
        }
      }

      function persistSavedBillboards() {
        localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(savedBillboards));
      }

      const assetsSectionCollapsedState = {
        saved: false,
        assets: false,
      };

      function setAssetsSectionCollapsed(sectionKey, shouldCollapse) {
        const sectionMap = {
          saved: {
            button: savedToggleButton,
            content: savedBillboardsList,
          },
          assets: {
            button: assetsToggleButton,
            content: assetsList,
          },
        };
        const targetSection = sectionMap[sectionKey];
        if (!targetSection) {
          return;
        }
        const button = targetSection.button;
        const content = targetSection.content;
        if (!(button instanceof HTMLButtonElement) || !(content instanceof HTMLElement)) {
          return;
        }
        const collapsed = !!shouldCollapse;
        assetsSectionCollapsedState[sectionKey] = collapsed;
        content.hidden = collapsed;
        button.textContent = collapsed ? "+" : "-";
        button.setAttribute("aria-expanded", String(!collapsed));
        button.setAttribute("aria-label", (collapsed ? "expand " : "collapse ") + sectionKey);
      }

      function setupAssetsSectionToggles() {
        const sections = [
          { key: "saved", button: savedToggleButton },
          { key: "assets", button: assetsToggleButton },
        ];
        for (const section of sections) {
          if (!(section.button instanceof HTMLButtonElement)) {
            continue;
          }
          section.button.addEventListener("click", () => {
            const nextState = !assetsSectionCollapsedState[section.key];
            setAssetsSectionCollapsed(section.key, nextState);
          });
          setAssetsSectionCollapsed(section.key, false);
        }
      }

      function clearSavedBillboardDropIndicators() {
        if (!(savedBillboardsList instanceof HTMLElement)) {
          return;
        }
        const rows = savedBillboardsList.querySelectorAll(".saved-billboard-row");
        for (const row of rows) {
          row.classList.remove("is-drop-target");
          row.classList.remove("is-dragging");
        }
      }

      function moveSavedBillboardById(sourceSnapshotId, targetSnapshotId, placeAfter = false) {
        const fromIndex = savedBillboards.findIndex((entry) => entry.id === sourceSnapshotId);
        const toIndex = savedBillboards.findIndex((entry) => entry.id === targetSnapshotId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return;
        }
        const [moved] = savedBillboards.splice(fromIndex, 1);
        let insertIndex = toIndex;
        if (fromIndex < toIndex) {
          insertIndex -= 1;
        }
        if (placeAfter) {
          insertIndex += 1;
        }
        insertIndex = Math.max(0, Math.min(insertIndex, savedBillboards.length));
        savedBillboards.splice(insertIndex, 0, moved);
        persistSavedBillboards();
        renderSavedBillboardsList();
      }

      function renderSavedBillboardsList() {
        if (!(savedBillboardsList instanceof HTMLElement)) {
          return;
        }
        savedBillboardsList.innerHTML = "";
        if (!savedBillboards.length) {
          const empty = document.createElement("div");
          empty.className = "saved-billboards-empty";
          empty.textContent = "placeholder";
          savedBillboardsList.appendChild(empty);
          return;
        }
        for (const snapshot of savedBillboards) {
          const row = document.createElement("div");
          row.className = "saved-billboard-row";
          row.dataset.snapshotId = snapshot.id;
          row.draggable = true;
          row.addEventListener("dragstart", (event) => {
            draggingSavedSnapshotId = snapshot.id;
            row.classList.add("is-dragging");
            if (event.dataTransfer) {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", snapshot.id);
            }
          });
          row.addEventListener("dragover", (event) => {
            if (!draggingSavedSnapshotId || draggingSavedSnapshotId === snapshot.id) {
              return;
            }
            event.preventDefault();
            row.classList.add("is-drop-target");
            if (event.dataTransfer) {
              event.dataTransfer.dropEffect = "move";
            }
          });
          row.addEventListener("dragleave", () => {
            row.classList.remove("is-drop-target");
          });
          row.addEventListener("drop", (event) => {
            if (!draggingSavedSnapshotId || draggingSavedSnapshotId === snapshot.id) {
              return;
            }
            event.preventDefault();
            const rect = row.getBoundingClientRect();
            const placeAfter = event.clientY > rect.top + rect.height * 0.5;
            moveSavedBillboardById(draggingSavedSnapshotId, snapshot.id, placeAfter);
            draggingSavedSnapshotId = null;
            clearSavedBillboardDropIndicators();
          });
          row.addEventListener("dragend", () => {
            draggingSavedSnapshotId = null;
            clearSavedBillboardDropIndicators();
          });

          const openButton = document.createElement("button");
          openButton.type = "button";
          openButton.className = "saved-billboard-button";
          openButton.textContent = snapshot.name || "untitled snapshot";
          openButton.title = snapshot.name || "untitled snapshot";
          openButton.addEventListener("click", () => {
            loadBillboardSnapshot(snapshot.id, { updatePath: true, replaceHistory: false });
          });
          row.appendChild(openButton);

          const actions = document.createElement("div");
          actions.className = "saved-billboard-actions";

          const dragHandleButton = document.createElement("button");
          dragHandleButton.type = "button";
          dragHandleButton.className = "saved-billboard-action-button saved-billboard-drag-handle";
          dragHandleButton.textContent = "↕";
          dragHandleButton.title = "drag to reorder saved billboard";
          dragHandleButton.setAttribute("aria-label", "drag to reorder saved billboard");
          actions.appendChild(dragHandleButton);

          const renameButton = document.createElement("button");
          renameButton.type = "button";
          renameButton.className = "saved-billboard-action-button";
          renameButton.textContent = "rename";
          renameButton.title = "rename saved billboard";
          renameButton.addEventListener("click", () => {
            renameSavedBillboard(snapshot.id);
          });
          actions.appendChild(renameButton);

          const removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.className = "saved-billboard-action-button";
          removeButton.textContent = "x";
          removeButton.title = "remove saved billboard";
          removeButton.addEventListener("click", () => {
            removeSavedBillboard(snapshot.id);
          });
          actions.appendChild(removeButton);

          row.appendChild(actions);
          savedBillboardsList.appendChild(row);
        }
      }

      function renameSavedBillboard(snapshotId) {
        const index = savedBillboards.findIndex((entry) => entry.id === snapshotId);
        if (index === -1) {
          return;
        }
        const snapshot = savedBillboards[index];
        const currentName = String(snapshot.name || "untitled snapshot").trim();
        const nextNameInput = window.prompt("rename saved billboard", currentName);
        if (nextNameInput === null) {
          return;
        }
        const nextName = String(nextNameInput).trim();
        if (!nextName || nextName === currentName) {
          return;
        }
        savedBillboards[index] = {
          ...snapshot,
          name: nextName,
        };
        persistSavedBillboards();
        renderSavedBillboardsList();
        if (activeSnapshotId === snapshotId) {
          setPathForSnapshot(savedBillboards[index], true);
        }
      }

      function removeSavedBillboard(snapshotId) {
        const index = savedBillboards.findIndex((entry) => entry.id === snapshotId);
        if (index === -1) {
          return;
        }
        const snapshot = savedBillboards[index];
        const name = String(snapshot.name || "untitled snapshot").trim() || "untitled snapshot";
        const confirmed = window.confirm('remove saved billboard "' + name + '"?');
        if (!confirmed) {
          return;
        }
        const wasActiveSnapshot = activeSnapshotId === snapshotId;
        savedBillboards.splice(index, 1);
        persistSavedBillboards();
        renderSavedBillboardsList();
        if (wasActiveSnapshot) {
          loadBillboardMakerState({ updatePath: true, replaceHistory: true });
        }
      }

      function clearEditorAssetBlocks() {
        const editors = [visualEditorBlock, partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
        for (const editor of editors) {
          if (!(editor instanceof HTMLElement)) {
            continue;
          }
          const blocks = editor.querySelectorAll(".fake-asset-block");
          for (const block of blocks) {
            block.remove();
          }
        }
      }

      function updateAssetIdCounterFromState() {
        const allAssets = [
          ...(Array.isArray(editorState.assets) ? editorState.assets : []),
          ...(Array.isArray(editorState.partitionAssets?.left) ? editorState.partitionAssets.left : []),
          ...(Array.isArray(editorState.partitionAssets?.curve) ? editorState.partitionAssets.curve : []),
          ...(Array.isArray(editorState.partitionAssets?.right) ? editorState.partitionAssets.right : []),
        ];
        const existingMaxAssetId = allAssets.reduce((maxId, asset) => {
          const numericPart = Number(String(asset?.id || "").replace("asset-", ""));
          if (!Number.isFinite(numericPart)) {
            return maxId;
          }
          return Math.max(maxId, numericPart);
        }, 0);
        assetIdCounter = existingMaxAssetId + 1;
      }

      function rebuildEditorFromState(runtime = {}) {
        ensurePartitionSettingsState();
        stopMarqueeAnimation();
        clearAssetSelection();
        endPartitionPlacement();
        clearEditorAssetBlocks();

        const initialPartitionsEnabled = !!editorState.settings.partitionsEnabled;
        editorState.settings.partitionsEnabled = false;
        updateFlatBillboardOrientationClass();
        applyPartitionEditorRatios();
        setVerticalAlignment(editorState.settings.verticalAlignment, false);
        applyPaddingGuides(editorState.settings.paddingTB, editorState.settings.paddingLR, false);
        applyAssetGap(editorState.settings.assetGap, false);
        applyColors(editorState.settings.backgroundColor, editorState.settings.assetColor, false);
        applyGuidesVisibility(editorState.settings.showGuides !== false, false);
        for (const savedAsset of editorState.assets) {
          appendAssetBlock(savedAsset);
        }
        applyMarqueeSettings(editorState.settings.marqueeEnabled, editorState.settings.marqueeSpeed, editorState.settings.marqueeDirection, false);
        applyPartitionsSetting(initialPartitionsEnabled, false);
        updateAllAssetBlockSizes();
        updateScaleControlsAnchorTop();
        setScaleControlsVisible(false);
        updateScaleControlButtons();
        syncSettingsControlsFromState();
        setPreviewMode(editorState.settings.previewMode, { persist: false });

        marqueeProgressPx = Number.isFinite(Number(runtime.marqueeProgressPx))
          ? Number(runtime.marqueeProgressPx)
          : 0;
        const runtimePartitionProgress = runtime.partitionMarqueeProgressPx && typeof runtime.partitionMarqueeProgressPx === "object"
          ? runtime.partitionMarqueeProgressPx
          : {};
        partitionMarqueeProgressPx = {
          left: Number.isFinite(Number(runtimePartitionProgress.left)) ? Number(runtimePartitionProgress.left) : 0,
          curve: Number.isFinite(Number(runtimePartitionProgress.curve)) ? Number(runtimePartitionProgress.curve) : 0,
          right: Number.isFinite(Number(runtimePartitionProgress.right)) ? Number(runtimePartitionProgress.right) : 0,
        };

        if (editorState.settings.partitionsEnabled) {
          applyFlatBillboardTrackTransform();
        } else {
          const cycle = marqueeCyclePx > 0 ? marqueeCyclePx : marqueeCycleLength();
          if (editorState.settings.marqueeEnabled && cycle > 0) {
            applyMarqueePhaseOffsets(cycle);
            applyFlatBillboardTrackTransform();
          }
        }

        if (editorStage instanceof HTMLElement && !editorState.settings.marqueeEnabled) {
          const savedScrollLeft = Number(runtime.scrollLeft);
          const savedScrollTop = Number(runtime.scrollTop);
          editorStage.scrollLeft = Number.isFinite(savedScrollLeft) ? Math.max(0, savedScrollLeft) : 0;
          editorStage.scrollTop = Number.isFinite(savedScrollTop) ? Math.max(0, savedScrollTop) : 0;
          syncFlatBillboardViewportOffset();
        }
      }

      function saveBillboardSnapshot() {
        const now = new Date();
        const snapshot = {
          id: "snapshot-" + now.getTime() + "-" + Math.random().toString(16).slice(2),
          name: formatSnapshotTimestamp(now),
          createdAt: now.toISOString(),
          state: cloneJsonValue(editorState),
          runtime: {
            scrollLeft: editorStage instanceof HTMLElement ? editorStage.scrollLeft : 0,
            scrollTop: editorStage instanceof HTMLElement ? editorStage.scrollTop : 0,
            marqueeProgressPx,
            partitionMarqueeProgressPx: cloneJsonValue(partitionMarqueeProgressPx),
          },
        };
        savedBillboards.unshift(snapshot);
        persistSavedBillboards();
        renderSavedBillboardsList();
      }

      function loadBillboardSnapshot(snapshotId, options = {}) {
        const shouldUpdatePath = !!options.updatePath;
        const shouldReplaceHistory = !!options.replaceHistory;
        const snapshot = savedBillboards.find((entry) => entry.id === snapshotId);
        if (!snapshot || !snapshot.state) {
          return;
        }
        activeSnapshotId = snapshot.id;
        editorState.assets = Array.isArray(snapshot.state.assets) ? cloneJsonValue(snapshot.state.assets) : [];
        const partitionAssets = snapshot.state.partitionAssets && typeof snapshot.state.partitionAssets === "object"
          ? snapshot.state.partitionAssets
          : { left: [], curve: [], right: [] };
        editorState.partitionAssets = {
          left: Array.isArray(partitionAssets.left) ? cloneJsonValue(partitionAssets.left) : [],
          curve: Array.isArray(partitionAssets.curve) ? cloneJsonValue(partitionAssets.curve) : [],
          right: Array.isArray(partitionAssets.right) ? cloneJsonValue(partitionAssets.right) : [],
        };
        editorState.settings = snapshot.state.settings && typeof snapshot.state.settings === "object"
          ? cloneJsonValue(snapshot.state.settings)
          : cloneJsonValue(loadEditorState().settings);

        ensurePartitionSettingsState();
        recoverLikelyScaleRegression();
        updateAssetIdCounterFromState();
        const snapshotRuntime = snapshot.runtime && typeof snapshot.runtime === "object"
          ? snapshot.runtime
          : {};
        rebuildEditorFromState({
          ...snapshotRuntime,
          // Always restart marquee animation from the beginning when opening a saved snapshot.
          marqueeProgressPx: 0,
          partitionMarqueeProgressPx: {
            left: 0,
            curve: 0,
            right: 0,
          },
        });
        saveEditorState();
        if (shouldUpdatePath) {
          setPathForSnapshot(snapshot, shouldReplaceHistory);
        }
      }

      function loadSnapshotFromPathIfPresent() {
        const slug = snapshotSlugFromLocationPath();
        if (!slug) {
          return false;
        }
        const snapshot = findSavedBillboardBySlug(slug);
        if (!snapshot) {
          return false;
        }
        loadBillboardSnapshot(snapshot.id, { updatePath: true, replaceHistory: true });
        return true;
      }

      function startNewBlankBillboard(options = {}) {
        const shouldUpdatePath = !!options.updatePath;
        const shouldReplaceHistory = !!options.replaceHistory;
        activeSnapshotId = null;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          // ignore
        }
        const fresh = loadEditorState();
        editorState.assets = Array.isArray(fresh.assets) ? cloneJsonValue(fresh.assets) : [];
        const partitionAssets = fresh.partitionAssets && typeof fresh.partitionAssets === "object"
          ? fresh.partitionAssets
          : { left: [], curve: [], right: [] };
        editorState.partitionAssets = {
          left: Array.isArray(partitionAssets.left) ? cloneJsonValue(partitionAssets.left) : [],
          curve: Array.isArray(partitionAssets.curve) ? cloneJsonValue(partitionAssets.curve) : [],
          right: Array.isArray(partitionAssets.right) ? cloneJsonValue(partitionAssets.right) : [],
        };
        editorState.settings = fresh.settings && typeof fresh.settings === "object"
          ? cloneJsonValue(fresh.settings)
          : cloneJsonValue(loadEditorState().settings);
        ensurePartitionSettingsState();
        updateAssetIdCounterFromState();
        rebuildEditorFromState({});
        editorState.settings.preview3dCamera = sanitizePreview3dCameraSettings(editorState.settings.preview3dCamera);
        preview3dAutoFitPending = true;
        applyPreview3dCameraSettings(editorState.settings.preview3dCamera, {
          persist: false,
          redraw: previewMode === "3d",
          markUserAdjusted: false,
        });
        saveEditorState();
        if (shouldUpdatePath) {
          setPathToToolRoot(shouldReplaceHistory);
        }
      }

      function loadBillboardMakerState(options = {}) {
        const shouldUpdatePath = !!options.updatePath;
        const shouldReplaceHistory = !!options.replaceHistory;
        activeSnapshotId = null;
        const makerState = loadEditorState();
        editorState.assets = Array.isArray(makerState.assets) ? cloneJsonValue(makerState.assets) : [];
        const partitionAssets = makerState.partitionAssets && typeof makerState.partitionAssets === "object"
          ? makerState.partitionAssets
          : { left: [], curve: [], right: [] };
        editorState.partitionAssets = {
          left: Array.isArray(partitionAssets.left) ? cloneJsonValue(partitionAssets.left) : [],
          curve: Array.isArray(partitionAssets.curve) ? cloneJsonValue(partitionAssets.curve) : [],
          right: Array.isArray(partitionAssets.right) ? cloneJsonValue(partitionAssets.right) : [],
        };
        editorState.settings = makerState.settings && typeof makerState.settings === "object"
          ? cloneJsonValue(makerState.settings)
          : cloneJsonValue(loadEditorState().settings);

        ensurePartitionSettingsState();
        recoverLikelyScaleRegression();
        updateAssetIdCounterFromState();
        rebuildEditorFromState({});
        if (shouldUpdatePath) {
          setPathToToolRoot(shouldReplaceHistory);
        }
      }

      function recoverLikelyScaleRegression() {
        const allAssets = [
          ...(Array.isArray(editorState.assets) ? editorState.assets : []),
          ...(Array.isArray(editorState.partitionAssets?.left) ? editorState.partitionAssets.left : []),
          ...(Array.isArray(editorState.partitionAssets?.curve) ? editorState.partitionAssets.curve : []),
          ...(Array.isArray(editorState.partitionAssets?.right) ? editorState.partitionAssets.right : []),
        ].filter((asset) => asset && typeof asset === "object");
        if (!allAssets.length) {
          return;
        }
        let tinyCount = 0;
        for (const asset of allAssets) {
          const scale = Number(asset.scalePercent);
          if (Number.isFinite(scale) && scale <= 10) {
            tinyCount += 1;
          }
        }
        // Repair persisted state from the partition-settings regression where scale limits collapsed.
        if (tinyCount / allAssets.length < 0.8) {
          return;
        }
        for (const asset of allAssets) {
          asset.scalePercent = 100;
        }
        saveEditorState();
      }

      function partitionEditorForSettingsKey(key) {
        return partitionEditorForKey(key);
      }

      function partitionViewportFrameForKey(key) {
        return key === "left"
          ? partitionViewportFrameLeft
          : key === "curve"
            ? partitionViewportFrameCurve
            : key === "right"
              ? partitionViewportFrameRight
              : null;
      }

      function partitionViewportTimerForKey(key) {
        return key === "left"
          ? partitionViewportTimerLeft
          : key === "curve"
            ? partitionViewportTimerCurve
            : key === "right"
              ? partitionViewportTimerRight
              : null;
      }

      function partitionArtboardWidth(partitionKey) {
        const layout = partitionLayout()[partitionKey];
        if (!layout) {
          return artboardWidth;
        }
        return Math.max(1, Math.round(layout.widthRatio * artboardWidth));
      }

      function applyPartitionEditorRatios() {
        const layoutByKey = partitionLayout();
        for (const key of PARTITION_KEYS) {
          const editor = partitionEditorForSettingsKey(key);
          if (!(editor instanceof HTMLElement)) {
            continue;
          }
          // Partition editors keep full billboard ratio for editing context.
          editor.style.setProperty("--partition-width", String(artboardWidth));
          const frame = partitionViewportFrameForKey(key);
          const layout = layoutByKey[key];
          if (frame instanceof HTMLElement && layout) {
            frame.style.left = "0";
            frame.style.width = layout.widthRatio * 100 + "%";
          }
        }
        updatePartitionViewportFrames();
      }

      function ensurePartitionSettingsState() {
        const normalizedBillboardWidth = normalizeArtboardDimension(
          editorState.settings.billboardWidth,
          DEFAULT_ARTBOARD_WIDTH
        );
        const normalizedBillboardHeight = normalizeArtboardDimension(
          editorState.settings.billboardHeight,
          DEFAULT_ARTBOARD_HEIGHT
        );
        editorState.settings.billboardWidth = normalizedBillboardWidth;
        editorState.settings.billboardHeight = normalizedBillboardHeight;
        artboardWidth = normalizedBillboardWidth;
        artboardHeight = normalizedBillboardHeight;
        const normalizedCurve = sanitizeCurveSettings(
          editorState.settings.billboardCurveEnabled,
          editorState.settings.billboardCurveWidth,
          editorState.settings.billboardCurvePosition,
          normalizedBillboardWidth
        );
        editorState.settings.billboardCurveEnabled = normalizedCurve.enabled;
        editorState.settings.billboardCurveWidth = normalizedCurve.width;
        editorState.settings.billboardCurvePosition = normalizedCurve.position;
        curveEnabled = normalizedCurve.enabled;
        curveWidth = normalizedCurve.width;
        curvePosition = normalizedCurve.position;
        applyArtboardCssVariables();
        syncBillboardDimensionControls();
        syncBillboardCurveControls();
        editorState.settings.previewMode = normalizePreviewMode(editorState.settings.previewMode);
        const preview3dShadow = Number(editorState.settings.preview3dShadow);
        const preview3dGlare = Number(editorState.settings.preview3dGlare);
        editorState.settings.preview3dShadow = Number.isFinite(preview3dShadow)
          ? Math.max(0, Math.min(1, preview3dShadow))
          : PREVIEW3D_FX_DEFAULTS.shadow;
        editorState.settings.preview3dGlare = Number.isFinite(preview3dGlare)
          ? Math.max(0, Math.min(1, preview3dGlare))
          : PREVIEW3D_FX_DEFAULTS.glare;
        editorState.settings.preview3dCamera = sanitizePreview3dCameraSettings(editorState.settings.preview3dCamera);
        PREVIEW3D_CAMERA.yaw = editorState.settings.preview3dCamera.yaw;
        PREVIEW3D_CAMERA.pitch = editorState.settings.preview3dCamera.pitch;
        PREVIEW3D_CAMERA.perspective = editorState.settings.preview3dCamera.perspective;
        PREVIEW3D_CAMERA.zoom = editorState.settings.preview3dCamera.zoom;
        PREVIEW3D_CAMERA.targetX = editorState.settings.preview3dCamera.targetX;
        PREVIEW3D_CAMERA.targetY = editorState.settings.preview3dCamera.targetY;
        PREVIEW3D_CAMERA.targetZ = editorState.settings.preview3dCamera.targetZ;
        if (!editorState.settings.partitionSettings || typeof editorState.settings.partitionSettings !== "object") {
          editorState.settings.partitionSettings = {
            left: defaultPartitionSettings(),
            curve: defaultPartitionSettings(),
            right: defaultPartitionSettings(),
          };
        }
        if (!editorState.settings.partitionOrientations || typeof editorState.settings.partitionOrientations !== "object") {
          editorState.settings.partitionOrientations = { left: "horizontal", curve: "horizontal", right: "horizontal" };
        }
        for (const key of PARTITION_KEYS) {
          const current = editorState.settings.partitionSettings[key];
          if (!current || typeof current !== "object") {
            editorState.settings.partitionSettings[key] = defaultPartitionSettings();
          }
          const orientation = editorState.settings.partitionSettings[key].orientation;
          if (orientation !== "vertical" && orientation !== "horizontal") {
            editorState.settings.partitionSettings[key].orientation = "horizontal";
          }
          const explicit = editorState.settings.partitionOrientations[key];
          if (explicit === "vertical" || explicit === "horizontal") {
            editorState.settings.partitionSettings[key].orientation = explicit;
          } else {
            editorState.settings.partitionOrientations[key] = editorState.settings.partitionSettings[key].orientation;
          }
          editorState.settings.partitionSettings[key].marqueeEnabled = !!editorState.settings.partitionSettings[key].marqueeEnabled;
          const speed = Number(editorState.settings.partitionSettings[key].marqueeSpeed);
          editorState.settings.partitionSettings[key].marqueeSpeed = Number.isFinite(speed)
            ? Math.max(5, Math.min(600, speed))
            : 80;
          const direction = String(editorState.settings.partitionSettings[key].marqueeDirection || "rtl").toLowerCase();
          editorState.settings.partitionSettings[key].marqueeDirection = direction === "ltr" ? "ltr" : "rtl";
        }
        if (!PARTITION_KEYS.includes(editorState.settings.activePartitionKey)) {
          editorState.settings.activePartitionKey = "left";
        }
      }

      function currentSettingsTarget() {
        ensurePartitionSettingsState();
        if (editorState.settings.partitionsEnabled) {
          const key = editorState.settings.activePartitionKey;
          return { key, settings: editorState.settings.partitionSettings[key], partitioned: true };
        }
        return { key: "single", settings: editorState.settings, partitioned: false };
      }

      function isMarqueeEnabledForCurrentMode() {
        if (!editorState.settings.partitionsEnabled) {
          return !!editorState.settings.marqueeEnabled;
        }
        ensurePartitionSettingsState();
        return PARTITION_KEYS.some((key) => !!editorState.settings.partitionSettings[key].marqueeEnabled);
      }

      function syncSettingsControlsFromState() {
        const target = currentSettingsTarget();
        const source = target.settings;
        const forceShowAllRows = previewMode === "3d";
        const buttons = alignmentSettings.querySelectorAll(".alignment-button");
        for (const button of buttons) {
          const isSelected = button.dataset.align === source.verticalAlignment;
          button.classList.toggle("inactive", !isSelected);
          button.setAttribute("aria-checked", isSelected ? "true" : "false");
        }
        paddingTBControl.value = String(Number(source.paddingTB) || 0);
        paddingLRControl.value = String(Number(source.paddingLR) || 0);
        if (showGuidesControl instanceof HTMLInputElement) {
          showGuidesControl.checked = editorState.settings.showGuides !== false;
        }
        assetGapControl.value = String(Number(source.assetGap) || 0);
        backgroundColorControl.value = source.backgroundColor || "#ff00ff";
        assetColorControl.value = source.assetColor || "#1e6cff";
        if (orientationControl instanceof HTMLSelectElement) {
          orientationControl.value = source.orientation === "vertical" ? "vertical" : "horizontal";
        }
        const marqueeEnabled = !!source.marqueeEnabled;
        const marqueeSpeed = Math.max(5, Math.min(600, Number(source.marqueeSpeed) || 80));
        const marqueeDirection = source.marqueeDirection === "ltr" ? "ltr" : "rtl";
        marqueeSpeedControl.value = String(marqueeSpeed);
        marqueeDirectionControl.value = marqueeDirection;
        marqueeSpeedRow.hidden = !forceShowAllRows && !marqueeEnabled;
        marqueeDirectionRow.hidden = !forceShowAllRows && !marqueeEnabled;
        const toggleButtons = marqueeToggle.querySelectorAll(".marquee-choice");
        for (const button of toggleButtons) {
          const isOn = button.dataset.value === "on";
          const isSelected = marqueeEnabled ? isOn : !isOn;
          button.classList.toggle("inactive", !isSelected);
          button.setAttribute("aria-checked", isSelected ? "true" : "false");
        }
        if (partitionSettingsSelect instanceof HTMLSelectElement) {
          partitionSettingsSelect.hidden = !(forceShowAllRows || target.partitioned);
          partitionSettingsSelect.value = target.partitioned ? target.key : "left";
        }
        if (partitionTabsRow instanceof HTMLElement) {
          partitionTabsRow.hidden = !(forceShowAllRows && editorState.settings.partitionsEnabled);
        }
        if (preview3dShadowControl instanceof HTMLInputElement) {
          preview3dShadowControl.value = String(editorState.settings.preview3dShadow ?? PREVIEW3D_FX_DEFAULTS.shadow);
        }
        if (preview3dShadowValue instanceof HTMLElement) {
          preview3dShadowValue.textContent = Number(editorState.settings.preview3dShadow ?? PREVIEW3D_FX_DEFAULTS.shadow).toFixed(2);
        }
        if (preview3dGlareControl instanceof HTMLInputElement) {
          preview3dGlareControl.value = String(editorState.settings.preview3dGlare ?? PREVIEW3D_FX_DEFAULTS.glare);
        }
        if (preview3dGlareValue instanceof HTMLElement) {
          preview3dGlareValue.textContent = Number(editorState.settings.preview3dGlare ?? PREVIEW3D_FX_DEFAULTS.glare).toFixed(2);
        }
        syncPreview3dCameraControls();
      }

      function applyPartitionSettingsToEditors() {
        ensurePartitionSettingsState();
        for (const key of PARTITION_KEYS) {
          const editor = partitionEditorForSettingsKey(key);
          applySettingsToEditorElement(editor, editorState.settings.partitionSettings[key]);
        }
      }

      function truncateLabel(text, maxLength) {
        const value = String(text || "");
        if (value.length <= maxLength) {
          return value;
        }
        const tailLength = Math.min(12, value.length);
        const tail = value.slice(-tailLength);
        const headLength = Math.max(1, maxLength - tailLength - 1);
        return value.slice(0, headLength) + "…" + tail;
      }

      function normalizeAssetEntry(entry) {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const src = typeof entry.src === "string" ? entry.src : "";
        if (!src) {
          return null;
        }
        const name = typeof entry.name === "string" && entry.name ? entry.name : src.split("/").pop() || "asset";
        const groupRaw = typeof entry.group === "string" ? entry.group.toLowerCase() : "graphics";
        const group = groupRaw === "animations" ? "animations" : "graphics";
        return {
          id: src,
          src,
          url: apiPath(src),
          name,
          group,
        };
      }

      function resolveAssetUrlFromSrc(src) {
        if (!src) {
          return "";
        }
        if (/^https?:\/\//i.test(src)) {
          return src;
        }
        return apiPath(src);
      }

      function extensionOf(path) {
        const clean = String(path || "").split("?")[0].toLowerCase();
        const parts = clean.split(".");
        return parts.length > 1 ? parts[parts.length - 1] : "";
      }

      function isGraphicsSvgAsset(src, group) {
        return extensionOf(src) === "svg" && String(group || "").toLowerCase() === "graphics";
      }

      function shouldUseNoPreviewFill(src) {
        const ext = extensionOf(src);
        return ext !== "pdf";
      }

      function clearSvgColorUrlCache() {
        for (const objectUrl of svgColorUrlCache.values()) {
          URL.revokeObjectURL(objectUrl);
        }
        svgColorUrlCache.clear();
      }

      async function getSvgSource(src) {
        if (svgSourceCache.has(src)) {
          return svgSourceCache.get(src);
        }
        const response = await fetch(resolveAssetUrlFromSrc(src), { cache: "force-cache" });
        if (!response.ok) {
          throw new Error("Unable to load SVG source.");
        }
        const source = await response.text();
        svgSourceCache.set(src, source);
        return source;
      }

      function colorizeSvgSource(source, color) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(String(source || ""), "image/svg+xml");
          const svg = doc.querySelector("svg");
          if (!svg) {
            return source;
          }

          const isColorizablePaintValue = (value) => {
            const normalized = String(value || "").trim().toLowerCase();
            return !!normalized && normalized !== "none" && normalized !== "currentcolor" && normalized !== "inherit" && !normalized.startsWith("url(");
          };
          const rewritePaintDeclarations = (cssText) => String(cssText || "")
            .replace(/fill\s*:\s*([^;}{!]+)(!important)?/gi, (match, rawValue, important) => (
              isColorizablePaintValue(rawValue) ? ("fill:" + color + (important || "")) : match
            ))
            .replace(/stroke\s*:\s*([^;}{!]+)(!important)?/gi, (match, rawValue, important) => (
              isColorizablePaintValue(rawValue) ? ("stroke:" + color + (important || "")) : match
            ));

          const styleNodes = Array.from(svg.querySelectorAll("style"));
          for (const styleNode of styleNodes) {
            const css = String(styleNode.textContent || "");
            if (!css) {
              continue;
            }
            styleNode.textContent = rewritePaintDeclarations(css);
          }

          const paintableTags = new Set(["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "text"]);
          const nodes = Array.from(svg.querySelectorAll("*"));
          for (const node of nodes) {
            const tag = String(node.tagName || "").toLowerCase();
            if (!paintableTags.has(tag)) {
              continue;
            }
            const fill = node.getAttribute("fill");
            const stroke = node.getAttribute("stroke");
            const fillValue = String(fill || "").trim().toLowerCase();
            const strokeValue = String(stroke || "").trim().toLowerCase();

            if (fill !== null && isColorizablePaintValue(fillValue)) {
              node.setAttribute("fill", color);
            }
            if (stroke !== null && isColorizablePaintValue(strokeValue)) {
              node.setAttribute("stroke", color);
            }

            const style = node.getAttribute("style");
            if (style) {
              const rewritten = rewritePaintDeclarations(style);
              node.setAttribute("style", rewritten);
            }

            // If shape has no explicit paint at all, set fill only (never inject stroke).
            if (fill === null && stroke === null) {
              const hasPaintInStyle = /(?:^|;)\s*(fill|stroke)\s*:/i.test(String(style || ""));
              if (!hasPaintInStyle && tag !== "line") {
                node.setAttribute("fill", color);
              }
            }
          }

          return new XMLSerializer().serializeToString(svg);
        } catch (error) {
          return source;
        }
      }

      async function resolvePreviewUrl(src, group, colorOverride) {
        const ext = extensionOf(src);
        if (ext === "pdf") {
          return apiPath("api/asset-preview?src=" + encodeURIComponent(String(src || "")));
        }
        if (!isGraphicsSvgAsset(src, group)) {
          return resolveAssetUrlFromSrc(src);
        }
        const color = colorOverride || editorState.settings.assetColor;
        const cacheKey = src + "|" + color;
        if (svgColorUrlCache.has(cacheKey)) {
          return svgColorUrlCache.get(cacheKey);
        }
        const rawSvg = await getSvgSource(src);
        const colorizedSvg = colorizeSvgSource(rawSvg, color);
        const objectUrl = URL.createObjectURL(new Blob([colorizedSvg], { type: "image/svg+xml" }));
        svgColorUrlCache.set(cacheKey, objectUrl);
        return objectUrl;
      }

      function attachPreviewImageToBlock(block, src, group, colorOverride) {
        if (!block || !src) {
          return;
        }
        if (shouldUseNoPreviewFill(src)) {
          block.classList.remove("no-preview-no-fill");
          delete block.dataset.noPreviewLabel;
        } else {
          block.classList.add("no-preview-no-fill");
          block.dataset.noPreviewLabel = extensionOf(src).toUpperCase();
        }
        let frame = block.querySelector(".asset-preview-frame");
        if (!(frame instanceof HTMLElement)) {
          frame = document.createElement("div");
          frame.className = "asset-preview-frame";
          block.appendChild(frame);
        }
        const currentImage = frame.querySelector(".asset-preview-image");
        let image = currentImage;
        if (!(image instanceof HTMLImageElement)) {
          image = document.createElement("img");
          image.className = "asset-preview-image";
          image.alt = "";
          image.decoding = "async";
          image.loading = "lazy";
          image.addEventListener("error", () => {
            image.remove();
            frame.remove();
            block.classList.add("no-preview");
          });
          frame.appendChild(image);
        }
        block.dataset.assetSrc = src;
        block.dataset.assetGroup = group || "";
        block.classList.remove("no-preview");
        const token = String(Date.now()) + Math.random().toString(16).slice(2);
        image.dataset.previewToken = token;
        resolvePreviewUrl(src, group, colorOverride)
          .then((previewUrl) => {
            if (!image.isConnected || image.dataset.previewToken !== token) {
              return;
            }
            image.src = previewUrl;
          })
          .catch(() => {
            if (image.isConnected && image.dataset.previewToken === token) {
              image.remove();
              block.classList.add("no-preview");
            }
          });
      }

      function createAssetButton(asset) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "asset-button";
        const content = document.createElement("span");
        content.className = "asset-button-content";

        const thumb = document.createElement("img");
        thumb.className = "asset-thumb";
        const thumbExtension = extensionOf(asset.src);
        thumb.src = (thumbExtension === "pdf")
          ? apiPath("api/asset-preview?src=" + encodeURIComponent(String(asset.src || "")))
          : asset.url;
        thumb.alt = "";
        thumb.decoding = "async";
        thumb.loading = "lazy";
        thumb.addEventListener("error", () => {
          thumb.removeAttribute("src");
        });

        const label = document.createElement("span");
        label.className = "asset-label";
        label.textContent = truncateLabel(asset.name, 34);

        content.appendChild(thumb);
        content.appendChild(label);
        button.appendChild(content);
        button.title = asset.name;
        button.draggable = true;
        button.addEventListener("dragstart", (event) => {
          if (!editorState.settings.partitionsEnabled) {
            event.preventDefault();
            return;
          }
          beginPartitionPlacement(asset);
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData("text/plain", JSON.stringify({
              src: asset.src,
              name: asset.name,
              group: asset.group,
            }));
          }
        });
        button.addEventListener("dragend", () => {
          endPartitionPlacement();
        });
        button.addEventListener("click", async () => {
          const activeButton = assetsList.querySelector(".asset-button.active");
          if (activeButton) {
            activeButton.classList.remove("active");
          }
          button.classList.add("active");

          if (editorState.settings.partitionsEnabled) {
            beginPartitionPlacement(asset);
            return;
          }

          await addAssetTemplateToPrimaryEditor(asset);
        });
        return button;
      }

      function renderAssetList() {
        assetsList.innerHTML = "";
        if (!availableAssets.length) {
          const empty = document.createElement("div");
          empty.className = "assets-status";
          empty.textContent = "no assets found";
          assetsList.appendChild(empty);
          return;
        }
        const groups = [
          { key: "animations", label: "animations" },
          { key: "graphics", label: "graphics" },
        ];
        for (const groupMeta of groups) {
          const items = availableAssets.filter((asset) => asset.group === groupMeta.key);
          if (!items.length) {
            continue;
          }
          const group = document.createElement("div");
          group.className = "asset-group";

          const title = document.createElement("div");
          title.className = "asset-group-title";
          title.textContent = groupMeta.label;
          group.appendChild(title);

          for (const asset of items) {
            group.appendChild(createAssetButton(asset));
          }
          assetsList.appendChild(group);
        }
      }

      function fallbackDimensionsForAsset(asset) {
        const seedBase = String(asset && asset.name ? asset.name : asset && asset.src ? asset.src : "asset");
        let seed = 0;
        for (let i = 0; i < seedBase.length; i += 1) {
          seed = (seed + seedBase.charCodeAt(i) * (i + 1)) % 9973;
        }
        const width = 90 + (seed % 140);
        const height = 36 + (seed % 70);
        return { width, height };
      }

      async function resolveAssetDimensions(asset) {
        try {
          const previewUrl = await resolvePreviewUrl(asset.src, asset.group);
          const dims = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
              resolve({
                width: Math.max(1, image.naturalWidth || 0),
                height: Math.max(1, image.naturalHeight || 0),
              });
            };
            image.onerror = () => reject(new Error("image load failed"));
            image.src = previewUrl;
          });
          if (dims.width > 0 && dims.height > 0) {
            return dims;
          }
        } catch (error) {
          // Fall back to deterministic placeholder sizes for unsupported/broken assets.
        }
        return fallbackDimensionsForAsset(asset);
      }

      const GRAPHICS_UPLOAD_EXTENSIONS = new Set(["png", "jpg", "jpeg", "svg", "gif", "webp"]);

      function hasExternalFilePayload(event) {
        const types = event?.dataTransfer?.types;
        if (!types) {
          return false;
        }
        return Array.from(types).includes("Files");
      }

      function isUploadableGraphicsFile(file) {
        if (!(file instanceof File)) {
          return false;
        }
        const extension = extensionOf(file.name);
        if (GRAPHICS_UPLOAD_EXTENSIONS.has(extension)) {
          return true;
        }
        const mimeType = String(file.type || "").toLowerCase();
        return mimeType.startsWith("image/");
      }

      function assetTemplateFromEntry(entry) {
        if (!entry) {
          return null;
        }
        return {
          src: entry.src,
          name: entry.name,
          group: entry.group,
        };
      }

      async function uploadGraphicsFile(file) {
        const formData = new FormData();
        formData.append("group", "graphics");
        formData.append("file", file, file.name || "asset");
        const response = await fetch(apiPath("api/assets"), {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          let detail = "";
          try {
            const payload = await response.json();
            detail = typeof payload?.error === "string" ? payload.error : "";
          } catch (error) {
            detail = "";
          }
          const suffix = detail ? (": " + detail) : "";
          throw new Error("Upload failed" + suffix);
        }
        const payload = await response.json();
        const normalized = normalizeAssetEntry(payload);
        if (!normalized) {
          throw new Error("Upload returned invalid asset metadata.");
        }
        return normalized;
      }

      async function addAssetTemplateToPrimaryEditor(template) {
        const dimensions = await resolveAssetDimensions(template);
        const assetSnapshot = {
          id: "asset-" + assetIdCounter++,
          name: template.name,
          src: template.src,
          group: template.group,
          width: dimensions.width,
          height: dimensions.height,
          scalePercent: 100,
          rotationTurns: 0,
          cropLeft: 0,
          cropRight: 0,
        };
        editorState.assets.push(assetSnapshot);
        appendAssetBlock(assetSnapshot, visualEditorBlock, { select: true });
        syncFlatBillboardArtworks();
        saveEditorState();
      }

      async function handleGraphicsFilesDrop(event, options = {}) {
        const partitionKey = typeof options.partitionKey === "string" ? options.partitionKey : "";
        const droppedFiles = Array.from(event?.dataTransfer?.files || []);
        if (!droppedFiles.length) {
          return false;
        }
        const uploadableFiles = droppedFiles.filter((file) => isUploadableGraphicsFile(file));
        if (!uploadableFiles.length) {
          return false;
        }
        const uploadedEntries = [];
        for (const file of uploadableFiles) {
          try {
            const uploaded = await uploadGraphicsFile(file);
            uploadedEntries.push(uploaded);
          } catch (error) {
            // Keep processing remaining files even if one upload fails.
            console.error(error);
          }
        }
        if (!uploadedEntries.length) {
          return true;
        }
        await loadAvailableAssets();
        for (const uploadedEntry of uploadedEntries) {
          const template = assetTemplateFromEntry(uploadedEntry);
          if (!template) {
            continue;
          }
          if (editorState.settings.partitionsEnabled && PARTITION_KEYS.includes(partitionKey)) {
            await placePendingAssetInPartition(partitionKey, template);
            continue;
          }
          await addAssetTemplateToPrimaryEditor(template);
        }
        return true;
      }

      async function loadAvailableAssets() {
        assetsList.innerHTML = "";
        const loading = document.createElement("div");
        loading.className = "assets-status";
        loading.textContent = "loading assets…";
        assetsList.appendChild(loading);
        try {
          const response = await fetch(apiPath("api/assets"), { cache: "no-store" });
          if (!response.ok) {
            throw new Error("Failed to fetch assets.");
          }
          const payload = await response.json();
          const normalized = (Array.isArray(payload) ? payload : [])
            .map((entry) => normalizeAssetEntry(entry))
            .filter((entry) => !!entry);
          availableAssets = normalized;
          renderAssetList();
          hydrateSavedAssetsWithLiveSources();
        } catch (error) {
          assetsList.innerHTML = "";
          const message = document.createElement("div");
          message.className = "assets-status";
          message.textContent = "unable to load assets";
          assetsList.appendChild(message);
        }
      }

      function hydrateSavedAssetsWithLiveSources() {
        if (!availableAssets.length) {
          return;
        }
        const assetByName = new Map();
        for (const liveAsset of availableAssets) {
          assetByName.set(String(liveAsset.name || "").toLowerCase(), liveAsset);
        }

        let changed = false;
        for (const savedAsset of editorState.assets) {
          if (savedAsset && typeof savedAsset.src === "string" && savedAsset.src) {
            continue;
          }
          const match = assetByName.get(String(savedAsset && savedAsset.name ? savedAsset.name : "").toLowerCase());
          if (!match) {
            continue;
          }
          savedAsset.src = match.src;
          savedAsset.group = match.group;
          changed = true;
        }

        if (!changed) {
          return;
        }

        const blocks = visualEditorBlock.querySelectorAll(".fake-asset-block");
        for (const block of blocks) {
          const assetId = block.dataset.assetId;
          const savedAsset = editorState.assets.find((asset) => asset.id === assetId);
          if (!savedAsset || !savedAsset.src) {
            continue;
          }
          attachPreviewImageToBlock(block, savedAsset.src, savedAsset.group);
        }
        saveEditorState();
      }

      function appendAssetBlock(asset, targetEditor = visualEditorBlock, options = {}) {
        const block = document.createElement("div");
        block.className = "fake-asset-block";
        block.draggable = true;
        block.dataset.assetId = asset.id;
        block.dataset.originalWidth = String(asset.width);
        block.dataset.originalHeight = String(asset.height);
        block.dataset.scalePercent = String(asset.scalePercent);
        block.dataset.rotationTurns = String(asset.rotationTurns || 0);
        block.dataset.cropLeft = String(asset.cropLeft || 0);
        block.dataset.cropRight = String(asset.cropRight || 0);
        if (typeof asset.src === "string" && asset.src) {
          if (typeof options.partitionKey === "string" && PARTITION_KEYS.includes(options.partitionKey)) {
            block.dataset.partitionKey = options.partitionKey;
          }
          const partitionKey = block.dataset.partitionKey || "";
          const partitionColor = PARTITION_KEYS.includes(partitionKey)
            ? editorState.settings.partitionSettings?.[partitionKey]?.assetColor
            : undefined;
          attachPreviewImageToBlock(block, asset.src, asset.group, partitionColor);
        } else {
          block.classList.add("no-preview");
        }
        const leftHandle = document.createElement("button");
        leftHandle.type = "button";
        leftHandle.className = "asset-crop-handle";
        leftHandle.dataset.edge = "left";
        leftHandle.setAttribute("aria-label", "Crop left");
        block.appendChild(leftHandle);

        const rightHandle = document.createElement("button");
        rightHandle.type = "button";
        rightHandle.className = "asset-crop-handle";
        rightHandle.dataset.edge = "right";
        rightHandle.setAttribute("aria-label", "Crop right");
        block.appendChild(rightHandle);

        targetEditor.appendChild(block);
        updateAssetBlockSize(block);
        syncBillboardPaddingFromEditorPreview();
        if (options.select) {
          selectSingleAssetBlock(block);
        }
        return block;
      }

      function getCropValues(block) {
        const left = Math.max(0, Math.min(0.95, Number(block.dataset.cropLeft) || 0));
        const right = Math.max(0, Math.min(0.95, Number(block.dataset.cropRight) || 0));
        const total = left + right;
        if (total >= 0.95) {
          const scale = 0.95 / total;
          return {
            left: left * scale,
            right: right * scale,
          };
        }
        return { left, right };
      }

      function getSourceDimensions(block) {
        const originalWidth = Number(block.dataset.originalWidth);
        const originalHeight = Number(block.dataset.originalHeight);
        return {
          width: originalWidth,
          height: originalHeight,
        };
      }

      function resolveSourceDimensions(block) {
        const direct = getSourceDimensions(block);
        if (Number.isFinite(direct.width) && Number.isFinite(direct.height) && direct.width > 0 && direct.height > 0) {
          return direct;
        }

        const assetId = block?.dataset?.assetId;
        if (assetId) {
          const allAssets = [
            ...(Array.isArray(editorState.assets) ? editorState.assets : []),
            ...(Array.isArray(editorState.partitionAssets?.left) ? editorState.partitionAssets.left : []),
            ...(Array.isArray(editorState.partitionAssets?.curve) ? editorState.partitionAssets.curve : []),
            ...(Array.isArray(editorState.partitionAssets?.right) ? editorState.partitionAssets.right : []),
          ];
          const assetState = allAssets.find((asset) => asset && asset.id === assetId);
          if (assetState && Number.isFinite(assetState.width) && Number.isFinite(assetState.height) && assetState.width > 0 && assetState.height > 0) {
            block.dataset.originalWidth = String(assetState.width);
            block.dataset.originalHeight = String(assetState.height);
            return { width: assetState.width, height: assetState.height };
          }
        }

        const previewImage = block?.querySelector?.(".asset-preview-image");
        if (previewImage instanceof HTMLImageElement) {
          const naturalWidth = Number(previewImage.naturalWidth) || 0;
          const naturalHeight = Number(previewImage.naturalHeight) || 0;
          if (naturalWidth > 0 && naturalHeight > 0) {
            block.dataset.originalWidth = String(naturalWidth);
            block.dataset.originalHeight = String(naturalHeight);
            return { width: naturalWidth, height: naturalHeight };
          }
        }

        const fallbackWidth = Math.max(100, Number(block?.offsetWidth) || 0);
        const fallbackHeight = Math.max(60, Number(block?.offsetHeight) || 0);
        block.dataset.originalWidth = String(fallbackWidth);
        block.dataset.originalHeight = String(fallbackHeight);
        return { width: fallbackWidth, height: fallbackHeight };
      }

      function updateAssetBlockSize(block) {
        const metrics = computeRenderedAssetMetrics(block);
        if (!metrics) {
          return;
        }
        block.style.width = metrics.scaledWidth + "px";
        block.style.height = metrics.scaledHeight + "px";

        const previewFrame = block.querySelector(".asset-preview-frame");
        const previewImage = block.querySelector(".asset-preview-image");
        if (previewFrame instanceof HTMLElement && previewImage instanceof HTMLElement) {
          previewFrame.style.width = metrics.croppedScaledWidth + "px";
          previewFrame.style.height = metrics.croppedScaledHeight + "px";
          previewFrame.style.transform = "translate(-50%, -50%) rotate(" + metrics.rotationDegrees + "deg)";
          previewImage.style.width = metrics.sourceScaledWidth + "px";
          previewImage.style.height = metrics.sourceScaledHeight + "px";
          previewImage.style.transformOrigin = "50% 50%";
          previewImage.style.transform = "translateX(" + metrics.offsetX + "px)";
        }
        syncBillboardPaddingFromEditorPreview();
      }

      function getEditorInnerDimensions(editorEl) {
        const fallbackWidth = Math.max(1, visualEditorBlock instanceof HTMLElement ? visualEditorBlock.clientWidth : 1);
        const fallbackHeight = Math.max(1, visualEditorBlock instanceof HTMLElement ? visualEditorBlock.clientHeight : 1);
        if (!(editorEl instanceof HTMLElement)) {
          return { width: fallbackWidth, height: fallbackHeight };
        }
        const computed = window.getComputedStyle(editorEl);
        const paddingLeft = Number.parseFloat(computed.paddingLeft) || 0;
        const paddingRight = Number.parseFloat(computed.paddingRight) || 0;
        const paddingTop = Number.parseFloat(computed.paddingTop) || 0;
        const paddingBottom = Number.parseFloat(computed.paddingBottom) || 0;
        const innerWidth = Math.max(1, editorEl.clientWidth - paddingLeft - paddingRight);
        const innerHeight = Math.max(1, editorEl.clientHeight - paddingTop - paddingBottom);
        return {
          width: innerWidth,
          height: innerHeight,
        };
      }

      function resolveFitScaleAtHundred(block, source, crop, rotationTurns) {
        const blockEditor = block.closest(".visual-editor-block");
        const editorInner = getEditorInnerDimensions(blockEditor);
        const sourceWidth = Math.max(1, Number(source?.width) || 1);
        const sourceHeight = Math.max(1, Number(source?.height) || 1);
        const visibleWidthRatio = Math.max(0.05, 1 - crop.left - crop.right);
        const croppedSourceWidth = sourceWidth * visibleWidthRatio;
        const isQuarterTurn = rotationTurns % 2 === 1;
        const rotatedWidth = isQuarterTurn ? sourceHeight : croppedSourceWidth;
        const rotatedHeight = isQuarterTurn ? croppedSourceWidth : sourceHeight;
        const widthScale = editorInner.width / Math.max(1, rotatedWidth);
        const heightScale = editorInner.height / Math.max(1, rotatedHeight);
        return Math.max(0.0001, Math.min(widthScale, heightScale));
      }

      function computeRenderedAssetMetrics(block) {
        const source = resolveSourceDimensions(block);
        const crop = getCropValues(block);
        block.dataset.cropLeft = String(crop.left);
        block.dataset.cropRight = String(crop.right);
        const visibleWidthRatio = Math.max(0.05, 1 - crop.left - crop.right);
        const scalePercent = Number(block.dataset.scalePercent) || 100;
        const userScale = Math.max(0.1, scalePercent / 100);
        const rotationTurns = ((Number(block.dataset.rotationTurns) || 0) % 4 + 4) % 4;
        const isQuarterTurn = rotationTurns % 2 === 1;
        const rotationDegrees = rotationTurns * 90;
        const fitScaleAtHundred = resolveFitScaleAtHundred(block, source, crop, rotationTurns);
        const effectiveScale = userScale * fitScaleAtHundred;

        const baseSourceWidth = source.width * effectiveScale;
        const baseSourceHeight = source.height * effectiveScale;
        const baseCroppedWidth = baseSourceWidth * visibleWidthRatio;
        const baseCroppedHeight = baseSourceHeight;
        const baseFinalWidth = isQuarterTurn ? baseCroppedHeight : baseCroppedWidth;
        const baseFinalHeight = isQuarterTurn ? baseCroppedWidth : baseCroppedHeight;

        const sourceScaledWidth = Math.max(1, Math.round(baseSourceWidth));
        const sourceScaledHeight = Math.max(1, Math.round(baseSourceHeight));
        const croppedScaledWidth = Math.max(1, Math.round(baseCroppedWidth));
        const croppedScaledHeight = Math.max(1, Math.round(baseCroppedHeight));
        const scaledWidth = Math.max(1, Math.round(baseFinalWidth));
        const scaledHeight = Math.max(1, Math.round(baseFinalHeight));
        const offsetX = Math.round(((crop.right - crop.left) * sourceScaledWidth) / 2);
        return {
          scaledWidth,
          scaledHeight,
          sourceScaledWidth,
          sourceScaledHeight,
          croppedScaledWidth,
          croppedScaledHeight,
          offsetX,
          rotationDegrees,
        };
      }

      function updateAllAssetBlockSizes() {
        let blocks = [];
        if (!editorState.settings.partitionsEnabled) {
          blocks = getPrimaryAssetBlocks();
        } else {
          const editors = [partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
          for (const editor of editors) {
            if (editor instanceof HTMLElement) {
              blocks.push(...Array.from(editor.querySelectorAll(".fake-asset-block")));
            }
          }
        }
        for (const block of blocks) {
          updateAssetBlockSize(block);
        }
        updateScaleControlButtons();
        positionScaleControls();
      }

      function getSelectedAssetBlocks() {
        if (!editorState.settings.partitionsEnabled) {
          return Array.from(visualEditorBlock.querySelectorAll(".fake-asset-block.is-selected:not(.marquee-copy)"));
        }
        const editors = [partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
        const selected = [];
        for (const editor of editors) {
          if (!(editor instanceof HTMLElement)) {
            continue;
          }
          selected.push(...Array.from(editor.querySelectorAll(".fake-asset-block.is-selected")));
        }
        return selected;
      }

      function getSelectedAssetBlock() {
        const selectedBlocks = getSelectedAssetBlocks();
        if (!selectedBlocks.length) {
          return null;
        }
        return selectedBlocks[selectedBlocks.length - 1];
      }

      function setScaleControlsVisible(isVisible) {
        assetScaleControls.style.display = isVisible ? "inline-flex" : "none";
      }

      function updateScaleControlsAnchorTop() {
        const editorShell = editorStage.closest(".editor-shell");
        if (!(editorShell instanceof HTMLElement)) {
          return;
        }
        editorShell.style.setProperty("--asset-controls-top", editorStage.offsetHeight + "px");
      }

      function positionScaleControls() {
        const selectedBlock = getSelectedAssetBlock();
        if (!selectedBlock) {
          return;
        }
        const editorShell = editorStage.closest(".editor-shell");
        if (!(editorShell instanceof HTMLElement)) {
          return;
        }
        const shellRect = editorShell.getBoundingClientRect();
        const blockRect = selectedBlock.getBoundingClientRect();
        const centerX = blockRect.left - shellRect.left + (blockRect.width / 2);
        const controlsTop = blockRect.bottom - shellRect.top + 6;
        assetScaleControls.style.left = centerX + "px";
        assetScaleControls.style.top = controlsTop + "px";
      }

      function updateScaleControlsValue() {
        const selectedBlock = getSelectedAssetBlock();
        if (!selectedBlock) {
          return;
        }
        const scalePercent = Number(selectedBlock.dataset.scalePercent) || 100;
        assetScaleValue.textContent = Math.round(scalePercent) + "%";
      }

      function getScaleLimits(block) {
        return {
          minPercent: 10,
          maxPercent: 400,
        };
      }

      function updateScaleControlButtons() {
        const selectedBlock = getSelectedAssetBlock();
        if (!selectedBlock) {
          assetScaleDownButton.disabled = true;
          assetScaleUpButton.disabled = true;
          assetRotateButton.disabled = true;
          return;
        }
        const currentPercent = Number(selectedBlock.dataset.scalePercent) || 100;
        const limits = getScaleLimits(selectedBlock);
        assetScaleDownButton.disabled = currentPercent <= limits.minPercent;
        assetScaleUpButton.disabled = currentPercent >= limits.maxPercent;
        assetRotateButton.disabled = false;
      }

      function updateSelectionUi() {
        const block = getSelectedAssetBlock();
        if (!block) {
          setScaleControlsVisible(false);
          updateScaleControlButtons();
          syncFlatBillboardSelectionState();
          return;
        }
        updateScaleControlsValue();
        updateScaleControlButtons();
        positionScaleControls();
        setScaleControlsVisible(true);
        syncFlatBillboardSelectionState();
      }

      function clearAssetSelection() {
        const selectedBlocks = getSelectedAssetBlocks();
        for (const selectedBlock of selectedBlocks) {
          selectedBlock.classList.remove("is-selected");
        }
        updateSelectionUi();
      }

      function selectSingleAssetBlock(block) {
        clearAssetSelection();
        if (block) {
          block.classList.add("is-selected");
        }
        updateSelectionUi();
      }

      function addAssetBlockToSelection(block) {
        if (!block) {
          return;
        }
        block.classList.add("is-selected");
        updateSelectionUi();
      }

      function syncAssetStateFromBlock(block) {
        if (!block) {
          return;
        }
        const assetId = block.dataset.assetId;
        let assetState = editorState.assets.find((asset) => asset.id === assetId);
        if (!assetState && editorState.partitionAssets) {
          for (const partitionKey of PARTITION_KEYS) {
            const list = Array.isArray(editorState.partitionAssets[partitionKey]) ? editorState.partitionAssets[partitionKey] : [];
            const found = list.find((asset) => asset.id === assetId);
            if (found) {
              assetState = found;
              break;
            }
          }
        }
        if (!assetState) {
          return;
        }
        const parsedScale = Number(block.dataset.scalePercent);
        const parsedRotation = Number(block.dataset.rotationTurns);
        const parsedCropLeft = Number(block.dataset.cropLeft);
        const parsedCropRight = Number(block.dataset.cropRight);

        if (Number.isFinite(parsedScale)) {
          assetState.scalePercent = parsedScale;
        }
        if (Number.isFinite(parsedRotation)) {
          assetState.rotationTurns = parsedRotation;
        }
        assetState.cropLeft = Number.isFinite(parsedCropLeft) ? parsedCropLeft : 0;
        assetState.cropRight = Number.isFinite(parsedCropRight) ? parsedCropRight : 0;
      }

      function updateSelectedAssetScale(deltaPercent) {
        const selectedBlock = getSelectedAssetBlock();
        if (!selectedBlock) {
          return;
        }
        const currentPercent = Number(selectedBlock.dataset.scalePercent) || 100;
        const limits = getScaleLimits(selectedBlock);
        const nextPercent = Math.max(limits.minPercent, Math.min(limits.maxPercent, currentPercent + deltaPercent));
        if (nextPercent === currentPercent) {
          updateScaleControlButtons();
          return;
        }
        selectedBlock.dataset.scalePercent = String(nextPercent);
        updateAssetBlockSize(selectedBlock);
        updateScaleControlsValue();
        updateScaleControlButtons();
        positionScaleControls();

        const selectedAssetId = selectedBlock.dataset.assetId;
        if (selectedAssetId) {
          syncAssetStateFromBlock(selectedBlock);
          saveEditorState();
        }
      }

      function rotateSelectedAsset() {
        const selectedBlock = getSelectedAssetBlock();
        if (!selectedBlock) {
          return;
        }
        const currentTurns = Number(selectedBlock.dataset.rotationTurns) || 0;
        const nextTurns = (currentTurns + 1) % 4;
        selectedBlock.dataset.rotationTurns = String(nextTurns);
        updateAssetBlockSize(selectedBlock);
        updateScaleControlsValue();
        updateScaleControlButtons();
        positionScaleControls();

        const selectedAssetId = selectedBlock.dataset.assetId;
        if (selectedAssetId) {
          syncAssetStateFromBlock(selectedBlock);
          saveEditorState();
        }
      }

      function getAssetBlockFromEventTarget(target) {
        if (!(target instanceof HTMLElement)) {
          return null;
        }
        if (target.classList.contains("fake-asset-block")) {
          if (target.classList.contains("marquee-copy")) {
            return null;
          }
          return target;
        }
        const found = target.closest(".fake-asset-block");
        if (found && found.classList.contains("marquee-copy")) {
          return null;
        }
        return found;
      }

      function getPrimaryAssetBlocks() {
        return Array.from(visualEditorBlock.querySelectorAll(".fake-asset-block:not(.marquee-copy)"));
      }

      function partitionEditorForKey(partitionKey) {
        if (partitionKey === "left") {
          return partitionEditorLeft;
        }
        if (partitionKey === "curve") {
          return partitionEditorCurve;
        }
        if (partitionKey === "right") {
          return partitionEditorRight;
        }
        return null;
      }

      function clearPartitionEditors() {
        const editors = [partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
        for (const editor of editors) {
          if (editor instanceof HTMLElement) {
            const blocks = editor.querySelectorAll(".fake-asset-block");
            for (const block of blocks) {
              block.remove();
            }
          }
        }
      }

      function renderPartitionEditorsFromState() {
        clearPartitionEditors();
        for (const partitionKey of PARTITION_KEYS) {
          const editor = partitionEditorForKey(partitionKey);
          if (!(editor instanceof HTMLElement)) {
            continue;
          }
          const list = Array.isArray(editorState.partitionAssets && editorState.partitionAssets[partitionKey])
            ? editorState.partitionAssets[partitionKey]
            : [];
          for (const asset of list) {
            appendAssetBlock(asset, editor, { partitionKey });
          }
        }
      }

      function beginPartitionPlacement(assetTemplate) {
        pendingPartitionAsset = assetTemplate;
        document.body.style.cursor = "copy";
      }

      function endPartitionPlacement() {
        pendingPartitionAsset = null;
        document.body.style.cursor = "";
        const editors = [partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
        for (const editor of editors) {
          if (editor instanceof HTMLElement) {
            editor.classList.remove("is-drop-target");
          }
        }
      }

      async function placePendingAssetInPartition(partitionKey, fallbackTemplate = null) {
        const template = pendingPartitionAsset || fallbackTemplate;
        if (!template || !PARTITION_KEYS.includes(partitionKey)) {
          return;
        }
        editorState.settings.activePartitionKey = partitionKey;
        if (partitionSettingsSelect instanceof HTMLSelectElement) {
          partitionSettingsSelect.value = partitionKey;
        }
        syncSettingsControlsFromState();
        const dimensions = await resolveAssetDimensions(template);
        const assetSnapshot = {
          id: "asset-" + assetIdCounter++,
          name: template.name,
          src: template.src,
          group: template.group,
          width: dimensions.width,
          height: dimensions.height,
          scalePercent: 100,
          rotationTurns: 0,
          cropLeft: 0,
          cropRight: 0,
        };
        if (!editorState.partitionAssets || typeof editorState.partitionAssets !== "object") {
          editorState.partitionAssets = { left: [], curve: [], right: [] };
        }
        if (!Array.isArray(editorState.partitionAssets[partitionKey])) {
          editorState.partitionAssets[partitionKey] = [];
        }
        editorState.partitionAssets[partitionKey].push(assetSnapshot);
        const editor = partitionEditorForKey(partitionKey);
        if (editor instanceof HTMLElement) {
          appendAssetBlock(assetSnapshot, editor, { partitionKey });
        }
        endPartitionPlacement();
        syncFlatBillboardArtworks();
        saveEditorState();
      }

      function clearMarqueeCopies() {
        const copies = flatBillboardTrack.querySelectorAll(".marquee-copy");
        for (const copy of copies) {
          copy.remove();
        }
      }

      function configureMarqueeLayout() {
        flatBillboardTrack.style.flexDirection = "row";
        flatBillboardTrack.style.width = "max-content";
        flatBillboardTrack.style.height = "100%";
      }

      function buildMarqueeCopies() {
        clearMarqueeCopies();
        if (!editorState.settings.marqueeEnabled) {
          return;
        }
        const originals = Array.from(flatBillboardTrack.querySelectorAll(".flat-billboard-asset:not(.marquee-copy)"));
        if (!originals.length) {
          return;
        }
        const direction = editorState.settings.marqueeDirection;
        const horizontal = direction === "rtl" || direction === "ltr";
        const rotatedBillboard = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        const viewportLength = horizontal
          ? Math.max(1, (rotatedBillboard ? flatBillboard.clientHeight : flatBillboard.clientWidth) || 1)
          : Math.max(1, flatBillboard.clientHeight || 1);
        const runLength = marqueeCycleLength();
        const baseDuplicateSets = Math.max(1, Math.ceil((viewportLength + runLength) / Math.max(1, runLength)));
        // Rotated marquee needs one extra buffered run per side so cycle-wrap
        // always lands on already-present duplicate content.
        const duplicateSets = baseDuplicateSets + (rotatedBillboard && horizontal ? 1 : 0);
        const leadingDuplicateSets = duplicateSets + (rotatedBillboard && direction === "ltr" ? 1 : 0);
        const trailingDuplicateSets = duplicateSets + (rotatedBillboard && direction === "ltr" ? 1 : 0);
        for (let setIndex = 0; setIndex < leadingDuplicateSets; setIndex += 1) {
          for (let i = originals.length - 1; i >= 0; i -= 1) {
            const original = originals[i];
            const clone = original.cloneNode(true);
            clone.classList.add("marquee-copy");
            const previewSrc = original.dataset.previewSrc || "";
            if (previewSrc) {
              const cloneImage = clone.querySelector(".flat-billboard-asset-image");
              if (cloneImage instanceof HTMLImageElement) {
                cloneImage.src = previewSrc;
              }
            }
            flatBillboardTrack.insertBefore(clone, flatBillboardTrack.firstChild);
          }
        }
        for (let setIndex = 0; setIndex < trailingDuplicateSets; setIndex += 1) {
          for (const original of originals) {
            const clone = original.cloneNode(true);
            clone.classList.add("marquee-copy");
            const previewSrc = original.dataset.previewSrc || "";
            if (previewSrc) {
              const cloneImage = clone.querySelector(".flat-billboard-asset-image");
              if (cloneImage instanceof HTMLImageElement) {
                cloneImage.src = previewSrc;
              }
            }
            flatBillboardTrack.appendChild(clone);
          }
        }
      }

      function marqueeCycleLength() {
        const originals = Array.from(flatBillboardTrack.querySelectorAll(".flat-billboard-asset:not(.marquee-copy)"));
        if (!originals.length) {
          return 0;
        }
        const direction = editorState.settings.marqueeDirection;
        const horizontal = direction === "rtl" || direction === "ltr";
        const gap = Math.max(0, parseFloat(flatBillboardTrack.style.gap || "0") || 0);
        let run = 0;
        for (let index = 0; index < originals.length; index += 1) {
          const block = originals[index];
          run += horizontal ? block.offsetWidth : block.offsetHeight;
          if (index < originals.length - 1) {
            run += gap;
          }
        }
        // Include the boundary gap between the last item and the first item
        // of the next duplicated run for seamless wrap distance.
        run += gap;
        return Math.max(1, run);
      }

      function partitionMarqueeCycleLength(track) {
        if (!(track instanceof HTMLElement)) {
          return 0;
        }
        const originals = Array.from(track.querySelectorAll('.flat-billboard-asset[data-marquee-original="true"]'));
        if (!originals.length) {
          return 0;
        }
        const gap = Math.max(0, parseFloat(track.style.gap || "0") || 0);
        const originalMainSpan = Math.max(0, Number(track.dataset.originalMainSpan) || 0);
        if (originalMainSpan > 0) {
          // Prefer explicit computed span: reliable even before DOM layout settles.
          return Math.max(1, originalMainSpan + gap);
        }
        let run = 0;
        for (let index = 0; index < originals.length; index += 1) {
          const block = originals[index];
          const explicitWidth = parseFloat(block.style.width || "0");
          run += explicitWidth > 0 ? explicitWidth : block.offsetWidth;
          if (index < originals.length - 1) {
            run += gap;
          }
        }
        // Include the boundary gap between duplicated runs.
        run += gap;
        return Math.max(1, run);
      }

      function partitionMaxMarqueeCycleLength() {
        if (!(flatBillboardPartitionLayers instanceof HTMLElement)) {
          return 0;
        }
        let maxCycle = 0;
        const tracks = flatBillboardPartitionLayers.querySelectorAll(".flat-billboard-partition-track");
        for (const track of tracks) {
          maxCycle = Math.max(maxCycle, Number(track?.dataset?.marqueeCyclePx) || 0);
        }
        return maxCycle;
      }

      function applyPartitionMarqueeTransforms() {
        if (!(flatBillboardPartitionLayers instanceof HTMLElement)) {
          return;
        }
        const layers = flatBillboardPartitionLayers.querySelectorAll(".flat-billboard-partition-layer");
        for (const layer of layers) {
          const track = layer.querySelector(".flat-billboard-partition-track");
          const artboard = layer.querySelector(".flat-billboard-partition-artboard");
          if (!(track instanceof HTMLElement) || !(artboard instanceof HTMLElement)) {
            continue;
          }
          const partitionKey = layer.dataset.partitionKey || "";
          const partitionSettings = PARTITION_KEYS.includes(partitionKey)
            ? (editorState.settings.partitionSettings?.[partitionKey] || defaultPartitionSettings())
            : defaultPartitionSettings();
          const direction = partitionSettings.marqueeDirection === "ltr" ? "ltr" : "rtl";
          const marqueeEnabled = !!partitionSettings.marqueeEnabled;
          const progressPx = PARTITION_KEYS.includes(partitionKey) ? (Number(partitionMarqueeProgressPx[partitionKey]) || 0) : 0;
          const orientation = track.dataset.partitionOrientation === "vertical" ? "vertical" : "horizontal";
          const alignKey = track.dataset.partitionAlignment || "top";
          const originalMainSpan = Math.max(1, Number(track.dataset.originalMainSpan) || 1);
          let mainAxisOffset = 0;
          if (orientation === "vertical") {
            const containerMainSpan = Math.max(1, artboard.clientWidth || 1);
            // Keep alignment offsets bounded so center/bottom cannot push content
            // fully out of the partition when run length exceeds viewport span.
            const clampedMainSpan = Math.min(containerMainSpan, originalMainSpan);
            const alignmentSpan = Math.max(0, containerMainSpan - clampedMainSpan);
            // Match partitions-off behavior:
            // top => start, center => midpoint, bottom => end.
            if (alignKey === "center") {
              mainAxisOffset = alignmentSpan / 2;
            } else if (alignKey === "bottom") {
              mainAxisOffset = alignmentSpan;
            } else {
              mainAxisOffset = 0;
            }
          }
          let marqueeOffset = 0;
          if (marqueeEnabled) {
            const cycle = Math.max(0, Number(track.dataset.marqueeCyclePx) || 0);
            if (cycle > 0) {
              const cycleProgressPx = ((progressPx % cycle) + cycle) % cycle;
              const viewportSpan = Math.max(1, artboard.clientWidth || 1);
              const maxTravelPx = Math.max(0, cycle - viewportSpan);
              marqueeOffset = direction === "ltr"
                // Mirror RTL motion across the full run so wrap occurs at an
                // equivalent cycle boundary (prevents early duplicate reveal).
                ? -(cycle - cycleProgressPx)
                // Move across full cycle so partitions still animate when
                // a single run is shorter than the partition viewport.
                : -cycleProgressPx;
            }
          }
          const transformX = mainAxisOffset + marqueeOffset;
          const stableTransformX = Math.abs(transformX) < 0.001 ? 0 : transformX;
          track.style.transform = "translate3d(" + stableTransformX + "px, 0px, 0px)";
        }
      }

      function applyFlatBillboardTrackTransform() {
        if (!flatBillboardTrack) {
          return;
        }
        if (editorState.settings.partitionsEnabled) {
          applyPartitionMarqueeTransforms();
          updateEditorViewportFrame();
          return;
        }
        const x = billboardViewportOffsetX + billboardMarqueeOffsetX;
        const y = billboardViewportOffsetY + billboardMarqueeOffsetY;
        const rotateArtwork = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        if (rotateArtwork) {
          const billboardWidth = Math.max(1, flatBillboard?.clientWidth || 1);
          const billboardHeight = Math.max(1, flatBillboard?.clientHeight || 1);
          const rotatedArtworkWidth = Math.max(1, flatBillboardTrack.offsetHeight || 1);
          let alignmentShiftX = 0;
          if (editorState.settings.verticalAlignment === "center") {
            alignmentShiftX = (billboardWidth - rotatedArtworkWidth) / 2;
          } else if (editorState.settings.verticalAlignment === "bottom") {
            alignmentShiftX = billboardWidth - rotatedArtworkWidth;
          }
          flatBillboardTrack.style.transformOrigin = "top left";
          flatBillboardTrack.style.transform =
            "translate(" + (x + alignmentShiftX) + "px, " + y + "px) translateY(" + billboardHeight + "px) rotate(-90deg)";
        } else {
          flatBillboardTrack.style.transformOrigin = "";
          flatBillboardTrack.style.transform = "translate(" + x + "px, " + y + "px)";
        }
        updateEditorViewportFrame();
      }

      function updateEditorViewportFrame() {
        updatePartitionViewportFrames();
        if (!(billboardViewportFrame instanceof HTMLElement)) {
          return;
        }
        if (editorState.settings.partitionsEnabled) {
          billboardViewportFrame.style.display = "none";
          if (billboardViewportTimer instanceof HTMLElement) {
            billboardViewportTimer.style.display = "none";
          }
          return;
        }
        const scale = billboardScaleFactor();
        const billboardWidth = flatBillboard ? flatBillboard.clientWidth : 0;
        const billboardHeight = flatBillboard ? flatBillboard.clientHeight : 0;
        if (scale <= 0 || billboardWidth <= 0 || billboardHeight <= 0) {
          billboardViewportFrame.style.display = "none";
          return;
        }
        const trackX = billboardViewportOffsetX + editorMarqueeOffsetX;
        const trackY = billboardViewportOffsetY + editorMarqueeOffsetY;
        const frameLeft = -trackX / scale;
        const frameTop = -trackY / scale;
        const rotateArtwork = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        let frameWidth = (rotateArtwork ? billboardHeight : billboardWidth) / scale;
        let frameHeight = (rotateArtwork ? billboardWidth : billboardHeight) / scale;
        const editorHeight = Math.max(1, visualEditorBlock?.clientHeight || 1);
        if (frameHeight > editorHeight) {
          const ratio = editorHeight / frameHeight;
          frameHeight = editorHeight;
          frameWidth = frameWidth * ratio;
        }

        billboardViewportFrame.style.display = "block";
        billboardViewportFrame.style.left = frameLeft + "px";
        billboardViewportFrame.style.top = frameTop + "px";
        billboardViewportFrame.style.width = frameWidth + "px";
        billboardViewportFrame.style.height = frameHeight + "px";
        // Keep frame transparent to clicks; drag handling is border-hit tested
        // from editor mousedown so assets remain directly clickable.
        billboardViewportFrame.style.pointerEvents = "none";
        billboardViewportFrame.style.cursor = "default";

        if (billboardViewportTimer instanceof HTMLElement) {
          const timerLeft = frameLeft - editorStage.scrollLeft + frameWidth / 2;
          const timerTop = editorStage.offsetTop + frameTop - editorStage.scrollTop + frameHeight + 4;
          billboardViewportTimer.style.left = timerLeft + "px";
          billboardViewportTimer.style.top = timerTop + "px";
          const speed = Math.max(5, Number(editorState.settings.marqueeSpeed) || 80);
          const cyclePx = Math.max(1, marqueeCyclePx || marqueeCycleLength());
          const totalSeconds = cyclePx / speed;
          const currentSeconds = ((marqueeProgressPx % cyclePx) + cyclePx) % cyclePx / speed;
          const shouldShowTimer = editorState.settings.marqueeEnabled && totalSeconds > 0;
          billboardViewportTimer.style.display = shouldShowTimer ? "block" : "none";
          if (shouldShowTimer) {
            billboardViewportTimer.textContent = currentSeconds.toFixed(1) + "s / " + totalSeconds.toFixed(1) + "s";
          }
        }
      }

      function updatePartitionViewportFrames() {
        const layoutByKey = partitionLayout();
        for (const key of PARTITION_KEYS) {
          const frame = partitionViewportFrameForKey(key);
          const timer = partitionViewportTimerForKey(key);
          const layout = layoutByKey[key];
          const partitionSettings = editorState.settings.partitionSettings?.[key] || defaultPartitionSettings();
          const marqueeEnabled = !!partitionSettings.marqueeEnabled;
          const direction = partitionSettings.marqueeDirection === "ltr" ? "ltr" : "rtl";
          const speed = Math.max(5, Number(partitionSettings.marqueeSpeed) || 80);
          const progressPx = Number(partitionMarqueeProgressPx[key]) || 0;
          if (!(frame instanceof HTMLElement) || !layout) {
            if (timer instanceof HTMLElement) {
              timer.style.display = "none";
            }
            continue;
          }
          frame.style.width = layout.widthRatio * 100 + "%";
          if (!marqueeEnabled) {
            frame.style.left = "0";
            frame.style.top = "0";
            if (timer instanceof HTMLElement) {
              timer.style.display = "none";
            }
            continue;
          }
          const editor = partitionEditorForSettingsKey(key);
          if (!(editor instanceof HTMLElement)) {
            frame.style.left = "0";
            frame.style.top = "0";
            if (timer instanceof HTMLElement) {
              timer.style.display = "none";
            }
            continue;
          }
          const editorWidth = Math.max(1, editor.clientWidth || 1);
          const editorHeight = Math.max(1, editor.clientHeight || 1);
          const frameWidth = Math.max(1, editorWidth * layout.widthRatio);
          const maxFrameTravelPx = Math.max(0, editorWidth - frameWidth);
          const partitionBillboardSpan = Math.max(1, (flatBillboard?.clientWidth || 1) * layout.widthRatio);
          const partitionTrack = flatBillboardPartitionLayers instanceof HTMLElement
            ? flatBillboardPartitionLayers.querySelector(
              '.flat-billboard-partition-layer[data-partition-key="' + key + '"] .flat-billboard-partition-track'
            )
            : null;
          const cycle = Math.max(0, Number(partitionTrack?.dataset?.marqueeCyclePx) || 0);
          const cycleProgressPx = cycle > 0
            ? (((progressPx % cycle) + cycle) % cycle)
            : 0;
          const maxBillboardTravelPx = cycle > 0 ? Math.max(0, cycle - partitionBillboardSpan) : 0;
          const wrappedTravelPx = maxBillboardTravelPx > 0
            ? (cycleProgressPx % maxBillboardTravelPx)
            : 0;
          const travelRatio = maxBillboardTravelPx > 0
            ? (wrappedTravelPx / maxBillboardTravelPx)
            : 0;
          const totalSeconds = cycle > 0 ? (cycle / speed) : 0;
          const currentSeconds = cycle > 0 ? (cycleProgressPx / speed) : 0;
          const showTimers = editorState.settings.partitionsEnabled && marqueeEnabled && totalSeconds > 0;
          let left = 0;
          if (direction === "ltr") {
            // "right to left" starts from the right-most edge.
            left = maxFrameTravelPx * (1 - travelRatio);
          } else {
            left = maxFrameTravelPx * travelRatio;
          }
          frame.style.left = left + "px";
          frame.style.top = "0";
          if (timer instanceof HTMLElement) {
            timer.style.display = showTimers ? "block" : "none";
            if (showTimers) {
              timer.style.left = (left + (frameWidth / 2)) + "px";
              timer.style.top = (editorHeight + 4) + "px";
              timer.textContent = currentSeconds.toFixed(1) + "s / " + totalSeconds.toFixed(1) + "s";
            }
          }
        }
      }

      function applyMarqueePhaseOffsets(cycle) {
        if (!(cycle > 0)) {
          editorMarqueeOffsetX = 0;
          editorMarqueeOffsetY = 0;
          billboardMarqueeOffsetX = 0;
          billboardMarqueeOffsetY = 0;
          return;
        }
        const rawDirection = editorState.settings.marqueeDirection;
        const rotatedBillboard = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        const frameScale = Math.max(0.0001, billboardScaleFactor());
        const rotateFrame = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        const billboardSpan = rotateFrame
          ? Math.max(1, flatBillboard?.clientHeight || 1)
          : Math.max(1, flatBillboard?.clientWidth || 1);
        const editorSpan = Math.max(1, visualEditorBlock?.clientWidth || 1);
        const frameSpanInEditor = billboardSpan / frameScale;
        const maxEditorTravel = Math.max(0, editorSpan - frameSpanInEditor);
        const maxEditorTravelPx = maxEditorTravel * frameScale;
        const cycleProgressPx = ((marqueeProgressPx % cycle) + cycle) % cycle;
        const progressRatio = cycleProgressPx / cycle;
        const mappedTravelPx = maxEditorTravelPx * progressRatio;
        const maxBillboardTravelPx = Math.max(0, cycle - billboardSpan);
        if (!rotatedBillboard && (rawDirection === "rtl" || rawDirection === "ltr")) {
          const wrappedTravelPx = maxBillboardTravelPx > 0
            ? (cycleProgressPx % maxBillboardTravelPx)
            : 0;
          if (rawDirection === "rtl") {
            editorMarqueeOffsetX = -wrappedTravelPx;
          } else {
            editorMarqueeOffsetX = -(maxBillboardTravelPx - wrappedTravelPx);
          }
          editorMarqueeOffsetY = 0;
        } else if (rawDirection === "rtl") {
          const wrappedTravelPx = maxBillboardTravelPx > 0
            ? (cycleProgressPx % maxBillboardTravelPx)
            : 0;
          const boundaryGapPx = Math.max(0, parseFloat(flatBillboardTrack?.style?.gap || "0") || 0);
          const adjustedTravelPx = maxBillboardTravelPx > 0
            ? (((wrappedTravelPx - boundaryGapPx) % maxBillboardTravelPx) + maxBillboardTravelPx) % maxBillboardTravelPx
            : 0;
          // Vertical mode (UI label: left to right): move frame left->right.
          editorMarqueeOffsetX = -adjustedTravelPx;
          editorMarqueeOffsetY = 0;
        } else if (rawDirection === "ltr") {
          if (rotatedBillboard) {
            // Keep the vertical right-to-left frame contained in the editor
            // while moving right->left across the full marquee cycle.
            editorMarqueeOffsetX = -(maxEditorTravelPx - mappedTravelPx);
          } else {
            editorMarqueeOffsetX = -mappedTravelPx;
          }
          editorMarqueeOffsetY = 0;
        } else {
          editorMarqueeOffsetY = 0;
          editorMarqueeOffsetX = 0;
        }
        if (rotatedBillboard && (rawDirection === "rtl" || rawDirection === "ltr")) {
          billboardMarqueeOffsetX = 0;
          if (rawDirection === "rtl") {
            // Vertical mode (UI label: left to right): start with the
            // beginning of the artboard bottom-aligned, then move downward.
            billboardMarqueeOffsetY = cycleProgressPx;
          } else {
            // Vertical mode (UI label: right to left): start with the end of
            // the artboard top-aligned, then continue in the same direction.
            // Shift by one full run into buffered duplicate space so the next
            // artboard is already below and wrap stays seamless.
            billboardMarqueeOffsetY = maxBillboardTravelPx - cycleProgressPx + cycle;
          }
        } else if (rawDirection === "rtl") {
          // Keep current RTL start anchor (left-aligned) and wrap by full cycle.
          billboardMarqueeOffsetX = -cycleProgressPx;
          billboardMarqueeOffsetY = 0;
        } else if (rawDirection === "ltr") {
          // Keep current LTR behavior, but shift by one full run so wrapping
          // lands on an equivalent duplicate instead of jumping to the edge.
          billboardMarqueeOffsetX = -((maxBillboardTravelPx + cycle) - cycleProgressPx);
          billboardMarqueeOffsetY = 0;
        } else {
          billboardMarqueeOffsetY = 0;
          billboardMarqueeOffsetX = 0;
        }
      }

      function computeMarqueeTargetVisibility() {
        if (!(flatBillboard instanceof HTMLElement)) {
          return false;
        }
        if (document.hidden) {
          return false;
        }
        const rect = flatBillboard.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          return false;
        }
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        return rect.right > 0 && rect.bottom > 0 && rect.left < viewportWidth && rect.top < viewportHeight;
      }

      function shouldRunMarqueeAnimation() {
        return isMarqueeEnabledForCurrentMode() && marqueeTargetVisible && !document.hidden;
      }

      function syncMarqueeAnimationState() {
        if (shouldRunMarqueeAnimation()) {
          if (!marqueeAnimationRaf) {
            marqueeLastTimestamp = 0;
            marqueeAnimationRaf = window.requestAnimationFrame(stepMarquee);
          }
        } else if (marqueeAnimationRaf) {
          stopMarqueeAnimation();
        }
      }

      function refreshMarqueeTargetVisibility() {
        marqueeTargetVisible = computeMarqueeTargetVisibility();
        syncMarqueeAnimationState();
      }

      function initMarqueeVisibilityTracking() {
        marqueeTargetVisible = computeMarqueeTargetVisibility();
        if (flatBillboard instanceof HTMLElement && "IntersectionObserver" in window) {
          marqueeVisibilityObserver = new IntersectionObserver((entries) => {
            if (!entries.length) {
              return;
            }
            marqueeTargetVisible = entries[0].isIntersecting;
            syncMarqueeAnimationState();
          }, { root: null, threshold: 0.01 });
          marqueeVisibilityObserver.observe(flatBillboard);
        }
        document.addEventListener("visibilitychange", refreshMarqueeTargetVisibility);
        window.addEventListener("scroll", refreshMarqueeTargetVisibility, { passive: true });
      }

      function stepMarquee(now) {
        if (!shouldRunMarqueeAnimation()) {
          stopMarqueeAnimation();
          return;
        }
        if (!marqueeLastTimestamp) {
          marqueeLastTimestamp = now;
        }
        const dt = Math.max(0, (now - marqueeLastTimestamp) / 1000);
        marqueeLastTimestamp = now;
        if (editorState.settings.partitionsEnabled) {
          ensurePartitionSettingsState();
          let hasMovingPartition = false;
          for (const key of PARTITION_KEYS) {
            const partitionSettings = editorState.settings.partitionSettings[key];
            if (!partitionSettings?.marqueeEnabled) {
              continue;
            }
            const speed = Math.max(5, Number(partitionSettings.marqueeSpeed) || 80);
            const existingProgress = Number(partitionMarqueeProgressPx[key]) || 0;
            const nextProgress = existingProgress + (speed * dt);
            const partitionTrack = flatBillboardPartitionLayers instanceof HTMLElement
              ? flatBillboardPartitionLayers.querySelector(
                '.flat-billboard-partition-layer[data-partition-key="' + key + '"] .flat-billboard-partition-track'
              )
              : null;
            const cycle = Math.max(0, Number(partitionTrack?.dataset?.marqueeCyclePx) || 0);
            partitionMarqueeProgressPx[key] = cycle > 0
              ? (((nextProgress % cycle) + cycle) % cycle)
              : nextProgress;
            hasMovingPartition = true;
          }
          if (hasMovingPartition) {
            // Keep marquee motion on every frame, but throttle viewport/timer UI
            // updates to reduce partition-mode layout thrash and GC jitter.
            applyPartitionMarqueeTransforms();
            if (
              !partitionViewportUiLastUpdateMs
              || (now - partitionViewportUiLastUpdateMs) >= PARTITION_VIEWPORT_UI_INTERVAL_MS
            ) {
              updatePartitionViewportFrames();
              partitionViewportUiLastUpdateMs = now;
            }
          }
        } else {
          const speed = Math.max(5, Number(editorState.settings.marqueeSpeed) || 80);
          const delta = speed * dt;
          const cycle = marqueeCyclePx > 0 ? marqueeCyclePx : marqueeCycleLength();
          if (!(cycle > 0)) {
            marqueeAnimationRaf = window.requestAnimationFrame(stepMarquee);
            return;
          }
          marqueeProgressPx += delta;
          applyMarqueePhaseOffsets(cycle);
          applyFlatBillboardTrackTransform();
        }
        marqueeAnimationRaf = window.requestAnimationFrame(stepMarquee);
      }

      function stopMarqueeAnimation() {
        if (marqueeAnimationRaf) {
          window.cancelAnimationFrame(marqueeAnimationRaf);
          marqueeAnimationRaf = null;
        }
        marqueeLastTimestamp = 0;
        partitionViewportUiLastUpdateMs = 0;
        marqueeProgressPx = 0;
      }

      function startMarqueeAnimation() {
        stopMarqueeAnimation();
        marqueeLastTimestamp = 0;
        syncMarqueeAnimationState();
      }

      function applyMarqueeSettings(enabled, speed, direction, shouldPersist, options = {}) {
        const syncControls = options.syncControls !== false;
        const target = currentSettingsTarget();
        const sourceSettings = target.settings;
        const normalizedEnabled = !!enabled;
        const parsedSpeed = Number(speed);
        const normalizedSpeed = Number.isFinite(parsedSpeed)
          ? Math.max(5, Math.min(600, parsedSpeed))
          : Math.max(5, Math.min(600, Number(sourceSettings.marqueeSpeed) || 80));
        const normalizedDirection = direction === "ltr" ? "ltr" : "rtl";

        sourceSettings.marqueeEnabled = normalizedEnabled;
        sourceSettings.marqueeSpeed = normalizedSpeed;
        sourceSettings.marqueeDirection = normalizedDirection;
        if (!target.partitioned) {
          editorState.settings.marqueeEnabled = normalizedEnabled;
          editorState.settings.marqueeSpeed = normalizedSpeed;
          editorState.settings.marqueeDirection = normalizedDirection;
        }
        if (target.partitioned && PARTITION_KEYS.includes(target.key)) {
          partitionMarqueeProgressPx[target.key] = 0;
        }

        if (syncControls) {
          const forceShowAllRows = previewMode === "3d";
          marqueeSpeedControl.value = String(normalizedSpeed);
          marqueeDirectionControl.value = normalizedDirection;
          marqueeSpeedRow.hidden = !forceShowAllRows && !normalizedEnabled;
          marqueeDirectionRow.hidden = !forceShowAllRows && !normalizedEnabled;

          const toggleButtons = marqueeToggle.querySelectorAll(".marquee-choice");
          for (const button of toggleButtons) {
            const isOn = button.dataset.value === "on";
            const isSelected = normalizedEnabled ? isOn : !isOn;
            button.classList.toggle("inactive", !isSelected);
            button.setAttribute("aria-checked", isSelected ? "true" : "false");
          }
        }

        configureMarqueeLayout();
        billboardMarqueeOffsetX = 0;
        billboardMarqueeOffsetY = 0;
        editorMarqueeOffsetX = 0;
        editorMarqueeOffsetY = 0;
        marqueeProgressPx = 0;

        if (!isMarqueeEnabledForCurrentMode()) {
          stopMarqueeAnimation();
        }
        syncFlatBillboardArtworks();
        if (!editorState.settings.partitionsEnabled) {
          const cycle = marqueeCyclePx > 0 ? marqueeCyclePx : marqueeCycleLength();
          if (normalizedEnabled && cycle > 0) {
            applyMarqueePhaseOffsets(cycle);
            applyFlatBillboardTrackTransform();
            startMarqueeAnimation();
          }
        } else if (isMarqueeEnabledForCurrentMode()) {
          applyFlatBillboardTrackTransform();
          syncMarqueeAnimationState();
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function applyPartitionsSetting(enabled, shouldPersist) {
        const normalizedEnabled = !!enabled;
        editorState.settings.partitionsEnabled = normalizedEnabled;
        ensurePartitionSettingsState();
        applyPartitionEditorRatios();
        const toggleButtons = partitionsToggle.querySelectorAll(".marquee-choice");
        for (const button of toggleButtons) {
          const isOn = button.dataset.value === "on";
          const isSelected = normalizedEnabled ? isOn : !isOn;
          button.classList.toggle("inactive", !isSelected);
          button.setAttribute("aria-checked", isSelected ? "true" : "false");
        }
        if (singleEditorCanvas instanceof HTMLElement && partitionEditorGrid instanceof HTMLElement) {
          singleEditorCanvas.style.display = normalizedEnabled ? "none" : "";
          partitionEditorGrid.classList.toggle("is-visible", normalizedEnabled);
        }
        updateFlatBillboardOrientationClass();
        if (partitionSettingsSelect instanceof HTMLSelectElement) {
          partitionSettingsSelect.hidden = !(normalizedEnabled || previewMode === "3d");
          partitionSettingsSelect.value = editorState.settings.activePartitionKey || "left";
        }
        if (partitionTabsRow instanceof HTMLElement) {
          partitionTabsRow.hidden = !(previewMode === "3d" && normalizedEnabled);
        }
        if (billboardViewportFrame instanceof HTMLElement && normalizedEnabled) {
          billboardViewportFrame.style.display = "none";
        }
        if (billboardViewportTimer instanceof HTMLElement && normalizedEnabled) {
          billboardViewportTimer.style.display = "none";
        }
        if (!normalizedEnabled) {
          syncSettingsControlsFromState();
          applySettingsToEditorElement(visualEditorBlock, editorState.settings);
          flatBillboard.style.setProperty("--editor-bg", editorState.settings.backgroundColor || "#ff00ff");
          updateSelectionUi();
          updateEditorViewportFrame();
          endPartitionPlacement();
        } else {
          applyPartitionSettingsToEditors();
          syncSettingsControlsFromState();
          renderPartitionEditorsFromState();
          updateAllAssetBlockSizes();
        }
        syncFlatBillboardArtworks();
        const cycle = marqueeCyclePx > 0 ? marqueeCyclePx : marqueeCycleLength();
        if (!normalizedEnabled && editorState.settings.marqueeEnabled && cycle > 0) {
          applyMarqueePhaseOffsets(cycle);
          applyFlatBillboardTrackTransform();
          syncMarqueeAnimationState();
        } else if (normalizedEnabled && isMarqueeEnabledForCurrentMode()) {
          applyFlatBillboardTrackTransform();
          syncMarqueeAnimationState();
        } else if (marqueeAnimationRaf && !isMarqueeEnabledForCurrentMode()) {
          stopMarqueeAnimation();
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function updateFlatBillboardOrientationClass() {
        if (!(flatBillboard instanceof HTMLElement)) {
          return;
        }
        flatBillboard.classList.remove("is-vertical");
      }

      function applyOrientationSetting(orientationValue, shouldPersist) {
        const normalized = orientationValue === "vertical" ? "vertical" : "horizontal";
        const target = currentSettingsTarget();
        target.settings.orientation = normalized;
        if (!target.partitioned) {
          editorState.settings.orientation = normalized;
        } else {
          ensurePartitionSettingsState();
          editorState.settings.partitionOrientations[target.key] = normalized;
        }
        if (orientationControl instanceof HTMLSelectElement) {
          orientationControl.value = normalized;
        }
        updateFlatBillboardOrientationClass();
        syncBillboardPaddingFromEditorPreview();
        syncFlatBillboardArtworks();
        updateEditorViewportFrame();
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function beginCropDrag(event, handle) {
        const block = handle.closest(".fake-asset-block");
        if (!(block instanceof HTMLElement)) {
          return;
        }
        const edge = handle.dataset.edge;
        if (edge !== "left" && edge !== "right") {
          return;
        }
        const source = getSourceDimensions(block);
        const crop = getCropValues(block);
        const scalePercent = Number(block.dataset.scalePercent) || 100;
        const userScale = Math.max(0.1, scalePercent / 100);
        const rotationTurns = ((Number(block.dataset.rotationTurns) || 0) % 4 + 4) % 4;
        const fitScaleAtHundred = resolveFitScaleAtHundred(block, source, crop, rotationTurns);
        const effectiveScale = userScale * fitScaleAtHundred;
        const fullTargetWidth = Math.max(1, source.width * effectiveScale);
        cropDragState = {
          block,
          edge,
          startX: event.clientX,
          fullTargetWidth,
          startLeft: crop.left,
          startRight: crop.right,
        };
        block.classList.add("is-cropping");
      }

      function continueCropDrag(event) {
        if (!cropDragState) {
          return;
        }
        const { block, edge, startX, fullTargetWidth, startLeft, startRight } = cropDragState;
        const deltaX = event.clientX - startX;
        const deltaRatio = deltaX / fullTargetWidth;
        let nextLeft = startLeft;
        let nextRight = startRight;
        if (edge === "left") {
          nextLeft = startLeft + deltaRatio;
        } else {
          nextRight = startRight - deltaRatio;
        }
        nextLeft = Math.max(0, nextLeft);
        nextRight = Math.max(0, nextRight);
        const maxCombined = 0.95;
        if (nextLeft + nextRight > maxCombined) {
          if (edge === "left") {
            nextLeft = maxCombined - nextRight;
          } else {
            nextRight = maxCombined - nextLeft;
          }
        }
        block.dataset.cropLeft = String(Math.max(0, nextLeft));
        block.dataset.cropRight = String(Math.max(0, nextRight));
        updateAssetBlockSize(block);
        updateSelectionUi();
      }

      function endCropDrag() {
        if (!cropDragState) {
          return;
        }
        const { block } = cropDragState;
        block.classList.remove("is-cropping");
        syncAssetStateFromBlock(block);
        saveEditorState();
        cropDragState = null;
      }

      function beginViewportFrameDrag(event) {
        if (event.button !== 0) {
          return false;
        }
        if (!(visualEditorBlock instanceof HTMLElement) || !(billboardViewportFrame instanceof HTMLElement)) {
          return false;
        }
        // Never steal clicks from assets; allow normal asset selection/editing.
        if (getAssetBlockFromEventTarget(event.target)) {
          return false;
        }
        if (editorState.settings.marqueeEnabled || editorState.settings.partitionsEnabled) {
          return false;
        }
        if (billboardViewportFrame.style.display === "none") {
          return false;
        }
        const frameRect = billboardViewportFrame.getBoundingClientRect();
        if (frameRect.width <= 0 || frameRect.height <= 0) {
          return false;
        }
        const x = event.clientX;
        const y = event.clientY;
        const insideFrame = x >= frameRect.left && x <= frameRect.right && y >= frameRect.top && y <= frameRect.bottom;
        if (!insideFrame) {
          return false;
        }
        const borderHitThreshold = 6;
        const nearLeft = Math.abs(x - frameRect.left) <= borderHitThreshold;
        const nearRight = Math.abs(x - frameRect.right) <= borderHitThreshold;
        const nearTop = Math.abs(y - frameRect.top) <= borderHitThreshold;
        const nearBottom = Math.abs(y - frameRect.bottom) <= borderHitThreshold;
        const onFrameOutline = nearLeft || nearRight || nearTop || nearBottom;
        if (!onFrameOutline) {
          return false;
        }
        viewportFrameDragState = {
          startClientX: x,
          startTrackX: billboardViewportOffsetX + editorMarqueeOffsetX,
          scale: Math.max(0.0001, billboardScaleFactor()),
          maxTrackTravelPx: 0,
        };
        const rotateFrame = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        const billboardSpan = rotateFrame
          ? Math.max(1, flatBillboard?.clientHeight || 1)
          : Math.max(1, flatBillboard?.clientWidth || 1);
        const editorSpan = Math.max(1, visualEditorBlock?.clientWidth || 1);
        const frameSpanInEditor = billboardSpan / viewportFrameDragState.scale;
        const maxEditorTravel = Math.max(0, editorSpan - frameSpanInEditor);
        viewportFrameDragState.maxTrackTravelPx = maxEditorTravel * viewportFrameDragState.scale;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ew-resize";
        event.preventDefault();
        event.stopPropagation();
        return true;
      }

      function continueViewportFrameDrag(event) {
        if (!viewportFrameDragState) {
          return;
        }
        const deltaX = event.clientX - viewportFrameDragState.startClientX;
        const unclampedTrackX = viewportFrameDragState.startTrackX - (deltaX * viewportFrameDragState.scale);
        const nextTrackX = Math.max(
          -viewportFrameDragState.maxTrackTravelPx,
          Math.min(0, unclampedTrackX)
        );
        const nextEditorOffsetX = nextTrackX - billboardViewportOffsetX;
        editorMarqueeOffsetX = nextEditorOffsetX;
        editorMarqueeOffsetY = 0;
        const rotatedBillboard = !editorState.settings.partitionsEnabled && editorState.settings.orientation === "vertical";
        if (rotatedBillboard) {
          billboardMarqueeOffsetX = 0;
          billboardMarqueeOffsetY = -nextEditorOffsetX;
        } else {
          billboardMarqueeOffsetX = nextEditorOffsetX;
          billboardMarqueeOffsetY = 0;
        }
        applyFlatBillboardTrackTransform();
        positionScaleControls();
      }

      function endViewportFrameDrag() {
        if (!viewportFrameDragState) {
          return;
        }
        viewportFrameDragState = null;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      function animateSwapWithFlip(blockA, blockB, swapAction) {
        const firstRectA = blockA.getBoundingClientRect();
        const firstRectB = blockB.getBoundingClientRect();
        swapAction();
        const lastRectA = blockA.getBoundingClientRect();
        const lastRectB = blockB.getBoundingClientRect();

        const deltaAX = firstRectA.left - lastRectA.left;
        const deltaAY = firstRectA.top - lastRectA.top;
        const deltaBX = firstRectB.left - lastRectB.left;
        const deltaBY = firstRectB.top - lastRectB.top;

        blockA.style.transition = "none";
        blockB.style.transition = "none";
        blockA.style.transform = "translate(" + deltaAX + "px, " + deltaAY + "px)";
        blockB.style.transform = "translate(" + deltaBX + "px, " + deltaBY + "px)";

        requestAnimationFrame(() => {
          blockA.style.transition = "transform 180ms ease";
          blockB.style.transition = "transform 180ms ease";
          blockA.style.transform = "";
          blockB.style.transform = "";
        });
      }

      function swapAssetBlocks(blockA, blockB) {
        if (!blockA || !blockB || blockA === blockB || !blockA.parentNode || blockA.parentNode !== blockB.parentNode) {
          return false;
        }
        const parent = blockA.parentNode;
        const nextA = blockA.nextSibling;
        const nextB = blockB.nextSibling;

        animateSwapWithFlip(blockA, blockB, () => {
          if (nextA === blockB) {
            parent.insertBefore(blockB, blockA);
            return;
          }
          if (nextB === blockA) {
            parent.insertBefore(blockA, blockB);
            return;
          }
          parent.insertBefore(blockA, nextB);
          parent.insertBefore(blockB, nextA);
        });
        return true;
      }

      function syncAssetOrderFromDom() {
        if (!editorState.settings.partitionsEnabled) {
          const orderedIds = getPrimaryAssetBlocks().map((block) => block.dataset.assetId);
          const rankById = new Map();
          for (let index = 0; index < orderedIds.length; index += 1) {
            rankById.set(orderedIds[index], index);
          }
          editorState.assets.sort((a, b) => {
            const rankA = rankById.has(a.id) ? rankById.get(a.id) : Number.MAX_SAFE_INTEGER;
            const rankB = rankById.has(b.id) ? rankById.get(b.id) : Number.MAX_SAFE_INTEGER;
            return rankA - rankB;
          });
          return;
        }
        for (const partitionKey of PARTITION_KEYS) {
          const editor = partitionEditorForKey(partitionKey);
          if (!(editor instanceof HTMLElement)) {
            continue;
          }
          const orderedIds = Array.from(editor.querySelectorAll(".fake-asset-block")).map((block) => block.dataset.assetId);
          const rankById = new Map();
          for (let index = 0; index < orderedIds.length; index += 1) {
            rankById.set(orderedIds[index], index);
          }
          const list = Array.isArray(editorState.partitionAssets[partitionKey]) ? editorState.partitionAssets[partitionKey] : [];
          list.sort((a, b) => {
            const rankA = rankById.has(a.id) ? rankById.get(a.id) : Number.MAX_SAFE_INTEGER;
            const rankB = rankById.has(b.id) ? rankById.get(b.id) : Number.MAX_SAFE_INTEGER;
            return rankA - rankB;
          });
        }
      }

      function removeSelectedAsset() {
        const selectedBlocks = getSelectedAssetBlocks();
        if (!selectedBlocks.length) {
          return 0;
        }
        const selectedIds = new Set(selectedBlocks.map((selectedBlock) => selectedBlock.dataset.assetId));
        for (const selectedBlock of selectedBlocks) {
          selectedBlock.remove();
        }
        editorState.assets = editorState.assets.filter((asset) => !selectedIds.has(asset.id));
        if (editorState.partitionAssets) {
          for (const partitionKey of PARTITION_KEYS) {
            const list = Array.isArray(editorState.partitionAssets[partitionKey]) ? editorState.partitionAssets[partitionKey] : [];
            editorState.partitionAssets[partitionKey] = list.filter((asset) => !selectedIds.has(asset.id));
          }
        }
        clearAssetSelection();
        syncBillboardPaddingFromEditorPreview();
        saveEditorState();
        return selectedBlocks.length;
      }

      function applySettingsToEditorElement(editorEl, settingsObj) {
        if (!(editorEl instanceof HTMLElement) || !settingsObj) {
          return;
        }
        const align = alignmentMap[settingsObj.verticalAlignment] || "flex-start";
        editorEl.style.alignItems = align;
        editorEl.style.setProperty("--safe-top", (Number(settingsObj.paddingTB) || 0) + "px");
        editorEl.style.setProperty("--safe-bottom", (Number(settingsObj.paddingTB) || 0) + "px");
        editorEl.style.setProperty("--safe-left", (Number(settingsObj.paddingLR) || 0) + "px");
        editorEl.style.setProperty("--safe-right", (Number(settingsObj.paddingLR) || 0) + "px");
        editorEl.style.setProperty("--asset-gap", (Number(settingsObj.assetGap) || 0) + "px");
        if (typeof settingsObj.backgroundColor === "string") {
          editorEl.style.setProperty("--editor-bg", settingsObj.backgroundColor);
        }
        if (typeof settingsObj.assetColor === "string") {
          editorEl.style.setProperty("--asset-color", settingsObj.assetColor);
        }
      }

      function refreshPreview3dGeometry() {
        const THREE = getThreeLib();
        const mesh = preview3dThreeState.mesh;
        if (!THREE || !mesh) {
          return;
        }
        const nextGeometry = createCurvedBillboardGeometry(THREE);
        const previousGeometry = mesh.geometry;
        mesh.geometry = nextGeometry;
        if (previousGeometry && typeof previousGeometry.dispose === "function") {
          previousGeometry.dispose();
        }
      }

      function applyBillboardCurveSettings(nextEnabled, nextWidth, nextPosition, shouldPersist) {
        const normalized = sanitizeCurveSettings(nextEnabled, nextWidth, nextPosition, artboardWidth);
        curveEnabled = normalized.enabled;
        curveWidth = normalized.width;
        curvePosition = normalized.position;
        if (editorState && editorState.settings) {
          editorState.settings.billboardCurveEnabled = curveEnabled;
          editorState.settings.billboardCurveWidth = curveWidth;
          editorState.settings.billboardCurvePosition = curvePosition;
        }
        syncBillboardCurveControls();
        syncCurveGuidelineDisplay();
        preview3dForceTextureUpdate = true;
        preview3dAutoFitPending = true;
        refreshPreview3dGeometry();
        if (previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function applyBillboardDimensions(nextWidth, nextHeight, shouldPersist) {
        const normalizedWidth = normalizeArtboardDimension(nextWidth, artboardWidth);
        const normalizedHeight = normalizeArtboardDimension(nextHeight, artboardHeight);
        artboardWidth = normalizedWidth;
        artboardHeight = normalizedHeight;
        if (editorState && editorState.settings) {
          editorState.settings.billboardWidth = normalizedWidth;
          editorState.settings.billboardHeight = normalizedHeight;
        }
        const normalizedCurve = sanitizeCurveSettings(curveEnabled, curveWidth, curvePosition, artboardWidth);
        curveEnabled = normalizedCurve.enabled;
        curveWidth = normalizedCurve.width;
        curvePosition = normalizedCurve.position;
        if (editorState && editorState.settings) {
          editorState.settings.billboardCurveEnabled = curveEnabled;
          editorState.settings.billboardCurveWidth = curveWidth;
          editorState.settings.billboardCurvePosition = curvePosition;
        }
        applyArtboardCssVariables();
        syncBillboardDimensionControls();
        syncBillboardCurveControls();
        applyPartitionEditorRatios();
        updateAllAssetBlockSizes();
        syncBillboardPaddingFromEditorPreview();
        syncFlatBillboardViewportOffset();
        updateEditorViewportFrame();
        updatePartitionViewportFrames();
        preview3dForceTextureUpdate = true;
        preview3dAutoFitPending = true;
        refreshPreview3dGeometry();
        if (previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function setVerticalAlignment(alignKey, shouldPersist) {
        if (!alignmentMap[alignKey]) {
          return;
        }
        const target = currentSettingsTarget();
        target.settings.verticalAlignment = alignKey;
        const buttons = alignmentSettings.querySelectorAll(".alignment-button");
        for (const button of buttons) {
          const isSelected = button.dataset.align === alignKey;
          button.classList.toggle("inactive", !isSelected);
          button.setAttribute("aria-checked", isSelected ? "true" : "false");
        }
        if (target.partitioned) {
          const editor = partitionEditorForSettingsKey(target.key);
          applySettingsToEditorElement(editor, target.settings);
        } else {
          applySettingsToEditorElement(visualEditorBlock, editorState.settings);
        }
        syncFlatBillboardArtworks();
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function applyPaddingGuides(paddingTB, paddingLR, shouldPersist) {
        const normalizedTB = Math.max(0, Number(paddingTB) || 0);
        const normalizedLR = Math.max(0, Number(paddingLR) || 0);
        const target = currentSettingsTarget();
        target.settings.paddingTB = normalizedTB;
        target.settings.paddingLR = normalizedLR;
        if (target.partitioned) {
          const editor = partitionEditorForSettingsKey(target.key);
          applySettingsToEditorElement(editor, target.settings);
        } else {
          applySettingsToEditorElement(visualEditorBlock, editorState.settings);
        }
        paddingTBControl.value = String(normalizedTB);
        paddingLRControl.value = String(normalizedLR);
        syncBillboardPaddingFromEditorPreview();
        updateAllAssetBlockSizes();
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function applyAssetGap(assetGapValue, shouldPersist) {
        const normalizedGap = Math.max(0, Number(assetGapValue) || 0);
        const target = currentSettingsTarget();
        target.settings.assetGap = normalizedGap;
        if (target.partitioned) {
          const editor = partitionEditorForSettingsKey(target.key);
          applySettingsToEditorElement(editor, target.settings);
        } else {
          applySettingsToEditorElement(visualEditorBlock, editorState.settings);
        }
        assetGapControl.value = String(normalizedGap);
        syncFlatBillboardArtworks();
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function applyGuidesVisibility(enabled, shouldPersist) {
        const normalizedEnabled = enabled !== false;
        editorState.settings.showGuides = normalizedEnabled;
        document.body.classList.toggle("billboard-guides-hidden", !normalizedEnabled);
        if (showGuidesControl instanceof HTMLInputElement) {
          showGuidesControl.checked = normalizedEnabled;
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function syncPreview3dCameraStateFromRuntime() {
        editorState.settings.preview3dCamera = sanitizePreview3dCameraSettings(PREVIEW3D_CAMERA);
      }

      function syncPreview3dCameraControls() {
        const camera = sanitizePreview3dCameraSettings(
          editorState?.settings?.preview3dCamera || PREVIEW3D_CAMERA
        );
        if (preview3dYawControl instanceof HTMLInputElement) {
          preview3dYawControl.value = String(camera.yaw);
        }
        if (preview3dYawValue instanceof HTMLElement) {
          preview3dYawValue.textContent = camera.yaw.toFixed(2);
        }
        if (preview3dPitchControl instanceof HTMLInputElement) {
          preview3dPitchControl.value = String(camera.pitch);
        }
        if (preview3dPitchValue instanceof HTMLElement) {
          preview3dPitchValue.textContent = camera.pitch.toFixed(2);
        }
        if (preview3dPerspectiveControl instanceof HTMLInputElement) {
          preview3dPerspectiveControl.value = String(camera.perspective);
        }
        if (preview3dPerspectiveValue instanceof HTMLElement) {
          preview3dPerspectiveValue.textContent = camera.perspective.toFixed(2);
        }
        if (preview3dZoomControl instanceof HTMLInputElement) {
          preview3dZoomControl.value = String(camera.zoom);
        }
        if (preview3dZoomValue instanceof HTMLElement) {
          preview3dZoomValue.textContent = camera.zoom.toFixed(2);
        }
        if (preview3dTargetXControl instanceof HTMLInputElement) {
          preview3dTargetXControl.value = String(Math.round(camera.targetX));
        }
        if (preview3dTargetYControl instanceof HTMLInputElement) {
          preview3dTargetYControl.value = String(Math.round(camera.targetY));
        }
        if (preview3dTargetZControl instanceof HTMLInputElement) {
          preview3dTargetZControl.value = String(Math.round(camera.targetZ));
        }
      }

      function applyPreview3dCameraSettings(nextCamera, options = {}) {
        const persist = options.persist === true;
        const redraw = options.redraw !== false;
        const markUserAdjusted = options.markUserAdjusted !== false;
        const normalized = sanitizePreview3dCameraSettings(nextCamera || {});
        PREVIEW3D_CAMERA.yaw = normalized.yaw;
        PREVIEW3D_CAMERA.pitch = normalized.pitch;
        PREVIEW3D_CAMERA.perspective = normalized.perspective;
        PREVIEW3D_CAMERA.zoom = normalized.zoom;
        PREVIEW3D_CAMERA.targetX = normalized.targetX;
        PREVIEW3D_CAMERA.targetY = normalized.targetY;
        PREVIEW3D_CAMERA.targetZ = normalized.targetZ;
        clampPreview3dCamera();
        if (markUserAdjusted) {
          preview3dAutoFitPending = false;
        }
        syncPreview3dCameraStateFromRuntime();
        syncPreview3dCameraControls();
        if (redraw && previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
        if (persist) {
          saveEditorState();
        }
      }

      function applyPreview3dFxSettings(shadowValue, glareValue, shouldPersist) {
        const normalizedShadow = Math.max(0, Math.min(1, Number(shadowValue)));
        const normalizedGlare = Math.max(0, Math.min(1, Number(glareValue)));
        editorState.settings.preview3dShadow = Number.isFinite(normalizedShadow)
          ? normalizedShadow
          : PREVIEW3D_FX_DEFAULTS.shadow;
        editorState.settings.preview3dGlare = Number.isFinite(normalizedGlare)
          ? normalizedGlare
          : PREVIEW3D_FX_DEFAULTS.glare;
        if (preview3dShadowControl instanceof HTMLInputElement) {
          preview3dShadowControl.value = String(editorState.settings.preview3dShadow);
        }
        if (preview3dGlareControl instanceof HTMLInputElement) {
          preview3dGlareControl.value = String(editorState.settings.preview3dGlare);
        }
        if (preview3dShadowValue instanceof HTMLElement) {
          preview3dShadowValue.textContent = editorState.settings.preview3dShadow.toFixed(2);
        }
        if (preview3dGlareValue instanceof HTMLElement) {
          preview3dGlareValue.textContent = editorState.settings.preview3dGlare.toFixed(2);
        }
        if (previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
        if (shouldPersist) {
          saveEditorState();
        }
      }

      function syncBillboardPaddingFromEditorPreview() {
        const target = currentSettingsTarget();
        const referenceEditor = target.partitioned
          ? partitionEditorForSettingsKey(target.key)
          : visualEditorBlock;
        const editorHeight = Math.max(
          1,
          (referenceEditor instanceof HTMLElement
            ? (referenceEditor.clientHeight || parseFloat(window.getComputedStyle(referenceEditor).getPropertyValue("--editor-height")) || 200)
            : 200)
        );
        const topRatio = Math.max(0, Math.min(0.49, (Number(target.settings.paddingTB) || 0) / editorHeight));
        const targetArtboardWidth = target.partitioned ? partitionArtboardWidth(target.key) : artboardWidth;
        const referenceWidthFromHeight = Math.max(1, (editorHeight * targetArtboardWidth) / artboardHeight);
        const leftRatio = Math.max(0, Math.min(0.49, (Number(target.settings.paddingLR) || 0) / referenceWidthFromHeight));
        flatBillboard.style.setProperty("--safe-top-ratio", String(topRatio));
        flatBillboard.style.setProperty("--safe-bottom-ratio", String(topRatio));
        flatBillboard.style.setProperty("--safe-left-ratio", String(leftRatio));
        flatBillboard.style.setProperty("--safe-right-ratio", String(leftRatio));
        syncFlatBillboardArtworks();
        updateEditorViewportFrame();
      }

      function billboardScaleFactor(referenceEditor = visualEditorBlock) {
        const referenceHeight = referenceEditor instanceof HTMLElement
          ? (referenceEditor.clientHeight || parseFloat(window.getComputedStyle(referenceEditor).getPropertyValue("--editor-height")) || 200)
          : 200;
        const editorHeight = Math.max(1, referenceHeight);
        const billboardHeight = Math.max(1, flatBillboard.clientHeight || 1);
        return billboardHeight / editorHeight;
      }

      function syncFlatBillboardViewportOffset() {
        if (!flatBillboardTrack) {
          return;
        }
        if (editorState.settings.marqueeEnabled) {
          billboardViewportOffsetX = 0;
          billboardViewportOffsetY = 0;
        } else {
          const scaleFactor = billboardScaleFactor();
          billboardViewportOffsetX = -(editorStage.scrollLeft * scaleFactor);
          billboardViewportOffsetY = -(editorStage.scrollTop * scaleFactor);
        }
        applyFlatBillboardTrackTransform();
      }

      function syncFlatBillboardSelectionState() {
        if (!flatBillboardTrack) {
          return;
        }
        const selectedIds = new Set(getSelectedAssetBlocks().map((block) => block.dataset.assetId));
        const mirroredAssets = document.querySelectorAll("#flatBillboardTrack .flat-billboard-asset, #flatBillboardPartitionLayers .flat-billboard-asset");
        for (const mirroredAsset of mirroredAssets) {
          const assetId = mirroredAsset.dataset.assetId || "";
          mirroredAsset.classList.toggle("is-selected", selectedIds.has(assetId));
        }
      }

      function partitionPaddingRatios(partitionKey) {
        ensurePartitionSettingsState();
        const settings = editorState.settings.partitionSettings[partitionKey] || defaultPartitionSettings();
        const editor = partitionEditorForSettingsKey(partitionKey);
        const editorHeight = Math.max(
          1,
          (editor instanceof HTMLElement
            ? (editor.clientHeight || parseFloat(window.getComputedStyle(editor).getPropertyValue("--editor-height")) || 200)
            : 200)
        );
        const topRatio = Math.max(0, Math.min(0.49, (Number(settings.paddingTB) || 0) / editorHeight));
        const widthFromHeight = Math.max(1, (editorHeight * partitionArtboardWidth(partitionKey)) / artboardHeight);
        const sideRatio = Math.max(0, Math.min(0.49, (Number(settings.paddingLR) || 0) / widthFromHeight));
        return { topRatio, sideRatio };
      }

      function syncSinglePartitionPaddingGuides() {
        if (!(flatBillboardSinglePartitionGuides instanceof HTMLElement)) {
          return;
        }
        // In single-mode, the billboard-level background guides are sufficient.
        flatBillboardSinglePartitionGuides.classList.remove("is-visible");
        flatBillboardSinglePartitionGuides.innerHTML = "";
      }

      function syncPartitionPaddingGuides() {
        if (!(flatBillboardSinglePartitionGuides instanceof HTMLElement)) {
          return;
        }
        flatBillboardSinglePartitionGuides.innerHTML = "";
        const layoutByKey = partitionLayout();
        for (const partitionKey of PARTITION_KEYS) {
          const layout = layoutByKey[partitionKey];
          const ratios = partitionPaddingRatios(partitionKey);
          const guide = document.createElement("div");
          guide.className = "flat-billboard-single-partition-guide";
          guide.style.left = layout.offsetRatio * 100 + "%";
          guide.style.width = layout.widthRatio * 100 + "%";

          const edges = [
            { edge: "left", position: { left: (ratios.sideRatio * 100) + "%" } },
            { edge: "right", position: { right: (ratios.sideRatio * 100) + "%" } },
            { edge: "top", position: { top: (ratios.topRatio * 100) + "%" } },
            { edge: "bottom", position: { bottom: (ratios.topRatio * 100) + "%" } },
          ];
          for (const edgeDef of edges) {
            const line = document.createElement("div");
            line.className = "flat-billboard-single-partition-guide-line";
            line.dataset.edge = edgeDef.edge;
            for (const [key, value] of Object.entries(edgeDef.position)) {
              line.style[key] = value;
            }
            guide.appendChild(line);
          }
          flatBillboardSinglePartitionGuides.appendChild(guide);
        }
        flatBillboardSinglePartitionGuides.classList.add("is-visible");
      }

      function syncFlatBillboardPartitioned() {
        if (!(flatBillboardPartitionLayers instanceof HTMLElement)) {
          return;
        }
        flatBillboardTrack.style.display = "none";
        flatBillboardPartitionLayers.classList.add("is-visible");
        flatBillboardPartitionLayers.innerHTML = "";

        ensurePartitionSettingsState();
        const billboardHeight = Math.max(1, flatBillboard.clientHeight || 1);
        const layoutByKey = partitionLayout();

        for (const partitionKey of PARTITION_KEYS) {
          const layout = layoutByKey[partitionKey];
          const editor = partitionEditorForSettingsKey(partitionKey);
          const partitionSettings = editorState.settings.partitionSettings[partitionKey] || defaultPartitionSettings();
          const marqueeEnabled = !!partitionSettings.marqueeEnabled;
          const direction = partitionSettings.marqueeDirection === "ltr" ? "ltr" : "rtl";
          const baseScaleFactor = billboardScaleFactor(editor);
          const align = alignmentMap[partitionSettings.verticalAlignment] || "flex-start";
          const partitionPixelWidth = Math.max(1, (flatBillboard.clientWidth || 1) * layout.widthRatio);
          const partitionPixelHeight = billboardHeight;
          const renderScale = baseScaleFactor;
          const paddingTB = (Number(partitionSettings.paddingTB) || 0) * renderScale;
          let paddingLR = (Number(partitionSettings.paddingLR) || 0) * renderScale;
          const gap = (Number(partitionSettings.assetGap) || 0) * renderScale;
          if (marqueeEnabled) {
            // Keep duplicated runs seamless on the scrolling axis.
            paddingLR = 0;
          }
          const layer = document.createElement("div");
          layer.className = "flat-billboard-partition-layer";
          layer.dataset.partitionKey = partitionKey;
          layer.style.left = layout.offsetRatio * 100 + "%";
          layer.style.width = layout.widthRatio * 100 + "%";
          layer.style.top = "0";
          layer.style.bottom = "0";
          layer.style.height = "auto";
          layer.style.backgroundColor = "transparent";

          const artboard = document.createElement("div");
          artboard.className = "flat-billboard-partition-artboard";
          artboard.style.position = "absolute";
          artboard.style.left = "0";
          artboard.style.top = "0";
          if (partitionSettings.orientation === "vertical") {
            artboard.style.transformOrigin = "top left";
            artboard.style.transform = "translateY(" + billboardHeight + "px) rotate(-90deg)";
            // Swap rendered partition dimensions so rotated content remains
            // bounded by the visible billboard partition.
            artboard.style.width = Math.max(1, partitionPixelHeight) + "px";
            artboard.style.height = Math.max(1, partitionPixelWidth) + "px";
          } else {
            artboard.style.transformOrigin = "top left";
            artboard.style.transform = "none";
            artboard.style.width = Math.max(1, partitionPixelWidth) + "px";
            artboard.style.height = Math.max(1, partitionPixelHeight) + "px";
          }
          artboard.style.overflow = "hidden";
          artboard.style.backgroundColor = partitionSettings.backgroundColor || "#ff00ff";

          const track = document.createElement("div");
          track.className = "flat-billboard-partition-track";
          track.dataset.partitionKey = partitionKey;
          track.dataset.partitionOrientation = partitionSettings.orientation === "vertical" ? "vertical" : "horizontal";
          track.dataset.partitionAlignment = partitionSettings.verticalAlignment || "top";
          track.style.paddingTop = paddingTB + "px";
          track.style.paddingBottom = paddingTB + "px";
          track.style.paddingLeft = paddingLR + "px";
          track.style.paddingRight = paddingLR + "px";
          track.style.gap = gap + "px";
          if (partitionSettings.orientation === "vertical") {
            // Rotated track axes:
            // - justify-content controls screen vertical position (inverted)
            // - align-items controls screen horizontal position
            track.style.alignItems = "center";
            track.style.justifyContent = "flex-start";
          } else {
            track.style.alignItems = align;
            track.style.justifyContent = "flex-start";
          }
          track.style.setProperty("--asset-color", partitionSettings.assetColor || "#1e6cff");

          const blocks = editor instanceof HTMLElement ? Array.from(editor.querySelectorAll(".fake-asset-block")) : [];
          let originalMainSpan = 0;
          let originalCount = 0;
          const originalBlocks = [];
          for (const sourceBlock of blocks) {
            const editorMetrics = computeRenderedAssetMetrics(sourceBlock);
            if (!editorMetrics) {
              continue;
            }
            const previewImage = sourceBlock.querySelector(".asset-preview-image");
            const targetBlock = document.createElement("div");
            targetBlock.className = "flat-billboard-asset";
            if (sourceBlock.classList.contains("no-preview-no-fill")) {
              targetBlock.classList.add("no-preview-no-fill");
            }
            if (sourceBlock.dataset.noPreviewLabel) {
              targetBlock.dataset.noPreviewLabel = sourceBlock.dataset.noPreviewLabel;
            }
            targetBlock.dataset.assetId = sourceBlock.dataset.assetId || "";
            targetBlock.dataset.marqueeOriginal = "true";
            targetBlock.style.width = Math.max(1, editorMetrics.scaledWidth * renderScale) + "px";
            targetBlock.style.height = Math.max(1, editorMetrics.scaledHeight * renderScale) + "px";
            originalMainSpan += Math.max(1, editorMetrics.scaledWidth * renderScale);
            if (originalCount > 0) {
              originalMainSpan += gap;
            }
            originalCount += 1;
            originalBlocks.push(targetBlock);

            if (previewImage instanceof HTMLImageElement) {
              const assetFrame = document.createElement("div");
              assetFrame.className = "flat-billboard-asset-frame";
              assetFrame.style.width = Math.max(1, editorMetrics.croppedScaledWidth * renderScale) + "px";
              assetFrame.style.height = Math.max(1, editorMetrics.croppedScaledHeight * renderScale) + "px";
              assetFrame.style.transform = "translate(-50%, -50%) rotate(" + editorMetrics.rotationDegrees + "deg)";

              const assetImage = document.createElement("img");
              assetImage.className = "flat-billboard-asset-image";
              assetImage.alt = "";
              assetImage.decoding = "async";
              assetImage.loading = "lazy";
              assetImage.style.width = Math.max(1, editorMetrics.sourceScaledWidth * renderScale) + "px";
              assetImage.style.height = Math.max(1, editorMetrics.sourceScaledHeight * renderScale) + "px";
              assetImage.style.transformOrigin = "50% 50%";
              assetImage.style.transform = "translateX(" + editorMetrics.offsetX * renderScale + "px)";
              const src = sourceBlock.dataset.assetSrc || "";
              const group = sourceBlock.dataset.assetGroup || "";
              resolvePreviewUrl(src, group, partitionSettings.assetColor)
                .then((previewUrl) => {
                  if (assetImage.isConnected) {
                    assetImage.src = previewUrl;
                    targetBlock.dataset.previewSrc = previewUrl;
                    const copyImages = track.querySelectorAll(
                      '.flat-billboard-asset.marquee-copy[data-asset-id="' + (targetBlock.dataset.assetId || "") + '"] .flat-billboard-asset-image'
                    );
                    for (const copyImage of copyImages) {
                      if (copyImage instanceof HTMLImageElement) {
                        copyImage.src = previewUrl;
                      }
                    }
                  }
                })
                .catch(() => {
                  targetBlock.classList.add("no-preview");
                });
              assetFrame.appendChild(assetImage);
              targetBlock.appendChild(assetFrame);
            } else {
              targetBlock.classList.add("no-preview");
            }
            track.appendChild(targetBlock);
          }
          track.dataset.originalMainSpan = String(Math.max(1, originalMainSpan));
          if (marqueeEnabled && originalBlocks.length) {
            const viewportLength = Math.max(1, (artboard.clientWidth || partitionPixelWidth));
            const runLength = partitionMarqueeCycleLength(track);
            // Keep at least two duplicate runs buffered so narrow partitions
            // (like curve) don't reveal/hide originals at wrap boundaries.
            const duplicateSets = Math.max(2, Math.ceil((viewportLength + runLength) / Math.max(1, runLength)));
            const leadingDuplicateSets = duplicateSets + (direction === "ltr" ? 1 : 0);
            const trailingDuplicateSets = duplicateSets + (direction === "ltr" ? 1 : 0);
            for (let setIndex = 0; setIndex < leadingDuplicateSets; setIndex += 1) {
              for (let i = originalBlocks.length - 1; i >= 0; i -= 1) {
                const original = originalBlocks[i];
                const clone = original.cloneNode(true);
                clone.classList.add("marquee-copy");
                clone.dataset.marqueeOriginal = "false";
                const previewSrc = original.dataset.previewSrc || "";
                if (previewSrc) {
                  const cloneImage = clone.querySelector(".flat-billboard-asset-image");
                  if (cloneImage instanceof HTMLImageElement) {
                    cloneImage.src = previewSrc;
                  }
                }
                track.insertBefore(clone, track.firstChild);
              }
            }
            for (let setIndex = 0; setIndex < trailingDuplicateSets; setIndex += 1) {
              for (const original of originalBlocks) {
                const clone = original.cloneNode(true);
                clone.classList.add("marquee-copy");
                clone.dataset.marqueeOriginal = "false";
                const previewSrc = original.dataset.previewSrc || "";
                if (previewSrc) {
                  const cloneImage = clone.querySelector(".flat-billboard-asset-image");
                  if (cloneImage instanceof HTMLImageElement) {
                    cloneImage.src = previewSrc;
                  }
                }
                track.appendChild(clone);
              }
            }
          }
          track.dataset.marqueeCyclePx = marqueeEnabled ? String(partitionMarqueeCycleLength(track)) : "0";

          artboard.appendChild(track);
          layer.appendChild(artboard);
          flatBillboardPartitionLayers.appendChild(layer);
        }
        applyPartitionMarqueeTransforms();
        syncPartitionPaddingGuides();
        syncFlatBillboardSelectionState();
      }

      function syncFlatBillboardArtworks() {
        preview3dForceTextureUpdate = true;
        if (!flatBillboardTrack) {
          return;
        }
        if (editorState.settings.partitionsEnabled) {
          syncFlatBillboardPartitioned();
          return;
        }
        if (flatBillboardPartitionLayers instanceof HTMLElement) {
          flatBillboardPartitionLayers.classList.remove("is-visible");
          flatBillboardPartitionLayers.innerHTML = "";
        }
        syncSinglePartitionPaddingGuides();
        flatBillboardTrack.style.display = "";
        const scaleFactor = billboardScaleFactor();
        const align = alignmentMap[editorState.settings.verticalAlignment] || "flex-start";
        let paddingTB = (Number(editorState.settings.paddingTB) || 0) * scaleFactor;
        let paddingLR = (Number(editorState.settings.paddingLR) || 0) * scaleFactor;
        const gap = (Number(editorState.settings.assetGap) || 0) * scaleFactor;
        const direction = editorState.settings.marqueeDirection;
        const horizontalMarquee = editorState.settings.marqueeEnabled && (direction === "rtl" || direction === "ltr");

        // For seamless wrapping, remove padding on the scrolling axis so
        // original and duplicate runs are truly back-to-back.
        if (horizontalMarquee) {
          paddingLR = 0;
        }

        flatBillboardTrack.style.paddingTop = paddingTB + "px";
        flatBillboardTrack.style.paddingBottom = paddingTB + "px";
        flatBillboardTrack.style.paddingLeft = paddingLR + "px";
        flatBillboardTrack.style.paddingRight = paddingLR + "px";
        flatBillboardTrack.style.gap = gap + "px";
        flatBillboardTrack.style.alignItems = align;

        flatBillboardTrack.innerHTML = "";
        const orderedBlocks = getPrimaryAssetBlocks();
        for (const sourceBlock of orderedBlocks) {
          const editorMetrics = computeRenderedAssetMetrics(sourceBlock);
          if (!editorMetrics) {
            continue;
          }
          const previewImage = sourceBlock.querySelector(".asset-preview-image");

          const targetBlock = document.createElement("div");
          targetBlock.className = "flat-billboard-asset";
          if (sourceBlock.classList.contains("no-preview-no-fill")) {
            targetBlock.classList.add("no-preview-no-fill");
          }
          if (sourceBlock.dataset.noPreviewLabel) {
            targetBlock.dataset.noPreviewLabel = sourceBlock.dataset.noPreviewLabel;
          }
          targetBlock.dataset.assetId = sourceBlock.dataset.assetId || "";
          targetBlock.style.width = Math.max(1, editorMetrics.scaledWidth * scaleFactor) + "px";
          targetBlock.style.height = Math.max(1, editorMetrics.scaledHeight * scaleFactor) + "px";

          if (previewImage instanceof HTMLImageElement) {
            const assetFrame = document.createElement("div");
            assetFrame.className = "flat-billboard-asset-frame";
            assetFrame.style.width = Math.max(1, editorMetrics.croppedScaledWidth * scaleFactor) + "px";
            assetFrame.style.height = Math.max(1, editorMetrics.croppedScaledHeight * scaleFactor) + "px";
            assetFrame.style.transform = "translate(-50%, -50%) rotate(" + editorMetrics.rotationDegrees + "deg)";

            const assetImage = document.createElement("img");
            assetImage.className = "flat-billboard-asset-image";
            assetImage.alt = "";
            assetImage.decoding = "async";
            assetImage.loading = "lazy";
            assetImage.style.width = Math.max(1, editorMetrics.sourceScaledWidth * scaleFactor) + "px";
            assetImage.style.height = Math.max(1, editorMetrics.sourceScaledHeight * scaleFactor) + "px";
            assetImage.style.transformOrigin = "50% 50%";
            assetImage.style.transform = "translateX(" + editorMetrics.offsetX * scaleFactor + "px)";
            const src = sourceBlock.dataset.assetSrc || "";
            const group = sourceBlock.dataset.assetGroup || "";
            resolvePreviewUrl(src, group)
              .then((previewUrl) => {
                if (assetImage.isConnected) {
                  assetImage.src = previewUrl;
                  targetBlock.dataset.previewSrc = previewUrl;
                  const copyImages = flatBillboardTrack.querySelectorAll(
                    '.flat-billboard-asset.marquee-copy[data-asset-id="' + (targetBlock.dataset.assetId || "") + '"] .flat-billboard-asset-image'
                  );
                  for (const copyImage of copyImages) {
                    if (copyImage instanceof HTMLImageElement) {
                      copyImage.src = previewUrl;
                    }
                  }
                }
              })
              .catch(() => {
                targetBlock.classList.add("no-preview");
              });
            assetFrame.appendChild(assetImage);
            targetBlock.appendChild(assetFrame);
          } else {
            targetBlock.classList.add("no-preview");
          }

          flatBillboardTrack.appendChild(targetBlock);
        }
        buildMarqueeCopies();
        marqueeCyclePx = marqueeCycleLength();
        syncFlatBillboardSelectionState();
        syncFlatBillboardViewportOffset();
      }

      function applyColors(backgroundColor, assetColor, shouldPersist) {
        const target = currentSettingsTarget();
        const previousAssetColor = target.settings.assetColor;
        target.settings.backgroundColor = backgroundColor;
        target.settings.assetColor = assetColor;
        if (target.partitioned) {
          const editor = partitionEditorForSettingsKey(target.key);
          applySettingsToEditorElement(editor, target.settings);
        } else {
          applySettingsToEditorElement(visualEditorBlock, editorState.settings);
          flatBillboard.style.setProperty("--editor-bg", backgroundColor);
        }
        backgroundColorControl.value = backgroundColor;
        assetColorControl.value = assetColor;
        if (previousAssetColor !== assetColor) {
          clearSvgColorUrlCache();
          const blocks = target.partitioned
            ? (partitionEditorForSettingsKey(target.key)?.querySelectorAll(".fake-asset-block") || [])
            : document.querySelectorAll("#visualEditorBlock .fake-asset-block");
          for (const block of blocks) {
            const src = block.dataset.assetSrc;
            const group = block.dataset.assetGroup;
            if (!src || !isGraphicsSvgAsset(src, group)) {
              continue;
            }
            attachPreviewImageToBlock(block, src, group, assetColor);
          }
        }
        syncFlatBillboardArtworks();
        if (shouldPersist) {
          saveEditorState();
        }
      }

      const editorState = loadEditorState();
      editorState.settings.preview3dCamera = sanitizePreview3dCameraSettings(editorState.settings.preview3dCamera);
      PREVIEW3D_CAMERA.yaw = editorState.settings.preview3dCamera.yaw;
      PREVIEW3D_CAMERA.pitch = editorState.settings.preview3dCamera.pitch;
      PREVIEW3D_CAMERA.perspective = editorState.settings.preview3dCamera.perspective;
      PREVIEW3D_CAMERA.zoom = editorState.settings.preview3dCamera.zoom;
      PREVIEW3D_CAMERA.targetX = editorState.settings.preview3dCamera.targetX;
      PREVIEW3D_CAMERA.targetY = editorState.settings.preview3dCamera.targetY;
      PREVIEW3D_CAMERA.targetZ = editorState.settings.preview3dCamera.targetZ;
      savedBillboards = loadSavedBillboards();
      setupAssetsSectionToggles();
      renderSavedBillboardsList();
      updateAssetIdCounterFromState();
      recoverLikelyScaleRegression();

      alignmentSettings.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }
        const alignKey = target.dataset.align;
        if (!alignKey || !alignmentMap[alignKey]) {
          return;
        }
        setVerticalAlignment(alignKey, true);
      });

      marqueeToggle.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }
        const value = target.dataset.value;
        if (value !== "on" && value !== "off") {
          return;
        }
        applyMarqueeSettings(value === "on", marqueeSpeedControl.value, marqueeDirectionControl.value, true);
      });

      partitionsToggle.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }
        const value = target.dataset.value;
        if (value !== "on" && value !== "off") {
          return;
        }
        applyPartitionsSetting(value === "on", true);
      });

      if (partitionSettingsSelect instanceof HTMLSelectElement) {
        partitionSettingsSelect.addEventListener("change", () => {
          const nextKey = partitionSettingsSelect.value;
          if (!PARTITION_KEYS.includes(nextKey)) {
            return;
          }
          editorState.settings.activePartitionKey = nextKey;
          syncSettingsControlsFromState();
          updateAllAssetBlockSizes();
          syncBillboardPaddingFromEditorPreview();
          syncFlatBillboardArtworks();
          saveEditorState();
        });
      }

      if (billboardWidthControl instanceof HTMLInputElement && billboardHeightControl instanceof HTMLInputElement) {
        const applyFromBillboardControls = () => {
          if (!billboardWidthControl.value.trim() || !billboardHeightControl.value.trim()) {
            return;
          }
          applyBillboardDimensions(billboardWidthControl.value, billboardHeightControl.value, true);
        };
        billboardWidthControl.addEventListener("input", applyFromBillboardControls);
        billboardHeightControl.addEventListener("input", applyFromBillboardControls);
        billboardWidthControl.addEventListener("blur", applyFromBillboardControls);
        billboardHeightControl.addEventListener("blur", applyFromBillboardControls);
      }
      if (billboardCurveToggle instanceof HTMLElement) {
        billboardCurveToggle.addEventListener("click", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLButtonElement)) {
            return;
          }
          const value = target.dataset.value;
          if (value !== "on" && value !== "off") {
            return;
          }
          applyBillboardCurveSettings(
            value === "on",
            billboardCurveWidthControl instanceof HTMLInputElement ? billboardCurveWidthControl.value : curveWidth,
            billboardCurvePositionControl instanceof HTMLInputElement ? billboardCurvePositionControl.value : curvePosition,
            true
          );
        });
      }
      if (billboardCurveWidthControl instanceof HTMLInputElement && billboardCurvePositionControl instanceof HTMLInputElement) {
        const applyBillboardCurveFromControls = () => {
          if (!billboardCurveWidthControl.value.trim() || !billboardCurvePositionControl.value.trim()) {
            return;
          }
          applyBillboardCurveSettings(
            curveEnabled,
            billboardCurveWidthControl.value,
            billboardCurvePositionControl.value,
            true
          );
        };
        billboardCurveWidthControl.addEventListener("input", applyBillboardCurveFromControls);
        billboardCurvePositionControl.addEventListener("input", applyBillboardCurveFromControls);
        billboardCurveWidthControl.addEventListener("blur", applyBillboardCurveFromControls);
        billboardCurvePositionControl.addEventListener("blur", applyBillboardCurveFromControls);
      }

      marqueeSpeedControl.addEventListener("input", () => {
        const raw = marqueeSpeedControl.value.trim();
        if (!raw) {
          return;
        }
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
          return;
        }
        const target = currentSettingsTarget();
        applyMarqueeSettings(!!target.settings.marqueeEnabled, parsed, marqueeDirectionControl.value, true, { syncControls: false });
      });

      marqueeSpeedControl.addEventListener("blur", () => {
        const target = currentSettingsTarget();
        applyMarqueeSettings(!!target.settings.marqueeEnabled, marqueeSpeedControl.value, marqueeDirectionControl.value, true);
      });

      marqueeDirectionControl.addEventListener("change", () => {
        const target = currentSettingsTarget();
        applyMarqueeSettings(!!target.settings.marqueeEnabled, marqueeSpeedControl.value, marqueeDirectionControl.value, true);
      });

      orientationControl.addEventListener("change", () => {
        applyOrientationSetting(orientationControl.value, true);
      });

      paddingTBControl.addEventListener("input", () => {
        applyPaddingGuides(paddingTBControl.value, paddingLRControl.value, true);
      });

      paddingLRControl.addEventListener("input", () => {
        applyPaddingGuides(paddingTBControl.value, paddingLRControl.value, true);
      });

      if (showGuidesControl instanceof HTMLInputElement) {
        showGuidesControl.addEventListener("change", () => {
          applyGuidesVisibility(showGuidesControl.checked, true);
        });
      }

      function readPreview3dCameraFromControls() {
        const read = (input, fallback) => {
          if (!(input instanceof HTMLInputElement)) {
            return fallback;
          }
          const parsed = Number(input.value);
          return Number.isFinite(parsed) ? parsed : fallback;
        };
        return {
          yaw: read(preview3dYawControl, PREVIEW3D_CAMERA.yaw),
          pitch: read(preview3dPitchControl, PREVIEW3D_CAMERA.pitch),
          perspective: read(preview3dPerspectiveControl, PREVIEW3D_CAMERA.perspective),
          zoom: read(preview3dZoomControl, PREVIEW3D_CAMERA.zoom),
          targetX: read(preview3dTargetXControl, PREVIEW3D_CAMERA.targetX),
          targetY: read(preview3dTargetYControl, PREVIEW3D_CAMERA.targetY),
          targetZ: read(preview3dTargetZControl, PREVIEW3D_CAMERA.targetZ),
        };
      }

      function applyPreview3dCameraFromControls(shouldPersist) {
        applyPreview3dCameraSettings(readPreview3dCameraFromControls(), {
          persist: shouldPersist,
          redraw: true,
          markUserAdjusted: true,
        });
      }

      const preview3dRangeControls = [
        preview3dYawControl,
        preview3dPitchControl,
        preview3dPerspectiveControl,
        preview3dZoomControl,
      ];
      for (const control of preview3dRangeControls) {
        if (!(control instanceof HTMLInputElement)) {
          continue;
        }
        control.addEventListener("input", () => {
          applyPreview3dCameraFromControls(false);
        });
        control.addEventListener("change", () => {
          applyPreview3dCameraFromControls(true);
        });
      }

      const preview3dTargetControls = [
        preview3dTargetXControl,
        preview3dTargetYControl,
        preview3dTargetZControl,
      ];
      for (const control of preview3dTargetControls) {
        if (!(control instanceof HTMLInputElement)) {
          continue;
        }
        control.addEventListener("input", () => {
          applyPreview3dCameraFromControls(false);
        });
        control.addEventListener("change", () => {
          applyPreview3dCameraFromControls(true);
        });
        control.addEventListener("blur", () => {
          applyPreview3dCameraFromControls(true);
        });
      }

      if (preview3dAutoFitButton instanceof HTMLButtonElement) {
        preview3dAutoFitButton.addEventListener("click", () => {
          preview3dAutoFitPending = true;
          if (!autoFitPreview3dCameraToCanvas({ force: true, persist: true })) {
            syncPreview3dCameraStateFromRuntime();
            syncPreview3dCameraControls();
            saveEditorState();
          }
          if (previewMode === "3d") {
            drawCurvedBillboard3dFrame();
          }
        });
      }

      if (preview3dResetButton instanceof HTMLButtonElement) {
        preview3dResetButton.addEventListener("click", () => {
          applyPreview3dCameraSettings(PREVIEW3D_CAMERA_DEFAULTS, {
            persist: true,
            redraw: true,
            markUserAdjusted: true,
          });
        });
      }
      if (preview3dShadowControl instanceof HTMLInputElement) {
        preview3dShadowControl.addEventListener("input", () => {
          const glareValue = preview3dGlareControl instanceof HTMLInputElement
            ? preview3dGlareControl.value
            : editorState.settings.preview3dGlare;
          applyPreview3dFxSettings(preview3dShadowControl.value, glareValue, true);
        });
      }
      if (preview3dGlareControl instanceof HTMLInputElement) {
        preview3dGlareControl.addEventListener("input", () => {
          const shadowValue = preview3dShadowControl instanceof HTMLInputElement
            ? preview3dShadowControl.value
            : editorState.settings.preview3dShadow;
          applyPreview3dFxSettings(shadowValue, preview3dGlareControl.value, true);
        });
      }

      if (saveBillboardButton instanceof HTMLButtonElement) {
        saveBillboardButton.addEventListener("click", () => {
          saveBillboardSnapshot();
        });
      }

      const previewModeButtons = [previewModeFlatButton, previewMode3dButton];
      for (const button of previewModeButtons) {
        if (!(button instanceof HTMLButtonElement)) {
          continue;
        }
        button.addEventListener("click", () => {
          setPreviewMode(button.dataset.value, { persist: true });
        });
      }

      if (newBillboardButton instanceof HTMLButtonElement) {
        newBillboardButton.addEventListener("click", () => {
          startNewBlankBillboard({ updatePath: true, replaceHistory: false });
        });
      }

      window.addEventListener("popstate", () => {
        if (!loadSnapshotFromPathIfPresent()) {
          loadBillboardMakerState({ updatePath: false, replaceHistory: true });
        }
      });

      assetGapControl.addEventListener("input", () => {
        applyAssetGap(assetGapControl.value, true);
      });

      backgroundColorControl.addEventListener("input", () => {
        applyColors(backgroundColorControl.value, assetColorControl.value, true);
      });

      assetColorControl.addEventListener("input", () => {
        applyColors(backgroundColorControl.value, assetColorControl.value, true);
      });

      visualEditorBlock.addEventListener("click", (event) => {
        const block = getAssetBlockFromEventTarget(event.target);
        if (block) {
          if (event.shiftKey) {
            addAssetBlockToSelection(block);
          } else {
            selectSingleAssetBlock(block);
          }
          return;
        }
        if (!event.shiftKey) {
          clearAssetSelection();
        }
      });

      const partitionEditors = [partitionEditorLeft, partitionEditorCurve, partitionEditorRight];
      for (const partitionEditor of partitionEditors) {
        if (!(partitionEditor instanceof HTMLElement)) {
          continue;
        }
        partitionEditor.addEventListener("click", async (event) => {
          const key = partitionEditor.dataset.partitionKey || "";
          if (editorState.settings.partitionsEnabled && PARTITION_KEYS.includes(key)) {
            editorState.settings.activePartitionKey = key;
            if (partitionSettingsSelect instanceof HTMLSelectElement) {
              partitionSettingsSelect.value = key;
            }
            syncSettingsControlsFromState();
          }
          if (pendingPartitionAsset) {
            await placePendingAssetInPartition(key);
            return;
          }
          const block = getAssetBlockFromEventTarget(event.target);
          if (block) {
            if (event.shiftKey) {
              addAssetBlockToSelection(block);
            } else {
              selectSingleAssetBlock(block);
            }
            return;
          }
          if (!event.shiftKey) {
            clearAssetSelection();
          }
        });

        partitionEditor.addEventListener("dragover", (event) => {
          if (hasExternalFilePayload(event)) {
            event.preventDefault();
            partitionEditor.classList.add("is-drop-target");
            if (event.dataTransfer) {
              event.dataTransfer.dropEffect = "copy";
            }
            return;
          }
          if (!editorState.settings.partitionsEnabled) {
            return;
          }
          event.preventDefault();
          partitionEditor.classList.add("is-drop-target");
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
          }
        });

        partitionEditor.addEventListener("dragleave", () => {
          partitionEditor.classList.remove("is-drop-target");
        });

        partitionEditor.addEventListener("drop", async (event) => {
          event.preventDefault();
          partitionEditor.classList.remove("is-drop-target");
          if (await handleGraphicsFilesDrop(event, { partitionKey: partitionEditor.dataset.partitionKey || "" })) {
            return;
          }
          const key = partitionEditor.dataset.partitionKey || "";
          let payload = null;
          if (event.dataTransfer) {
            const text = event.dataTransfer.getData("text/plain");
            if (text) {
              try {
                payload = JSON.parse(text);
              } catch (error) {
                payload = null;
              }
            }
          }
          await placePendingAssetInPartition(key, payload);
        });

        partitionEditor.addEventListener("dragstart", (event) => {
          if (cropDragState) {
            event.preventDefault();
            return;
          }
          const block = getAssetBlockFromEventTarget(event.target);
          if (!block) {
            event.preventDefault();
            return;
          }
          draggingAssetId = block.dataset.assetId;
          block.classList.add("is-dragging");
          selectSingleAssetBlock(block);
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", draggingAssetId);
          }
        });

        partitionEditor.addEventListener("dragenter", (event) => {
          if (!draggingAssetId) {
            return;
          }
          const hoveredBlock = getAssetBlockFromEventTarget(event.target);
          if (!hoveredBlock || hoveredBlock.dataset.assetId === draggingAssetId) {
            return;
          }
          const draggingBlock = partitionEditor.querySelector('[data-asset-id="' + draggingAssetId + '"]');
          if (!(draggingBlock instanceof HTMLElement)) {
            return;
          }
          const didSwap = swapAssetBlocks(draggingBlock, hoveredBlock);
          if (!didSwap) {
            return;
          }
          syncAssetOrderFromDom();
          saveEditorState();
          syncFlatBillboardArtworks();
          positionScaleControls();
        });

        partitionEditor.addEventListener("mousedown", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLElement) || !target.classList.contains("asset-crop-handle")) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          beginCropDrag(event, target);
        });
      }

      visualEditorBlock.addEventListener("mousedown", (event) => {
        if (beginViewportFrameDrag(event)) {
          return;
        }
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.classList.contains("asset-crop-handle")) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        beginCropDrag(event, target);
      });

      window.addEventListener("mousemove", (event) => {
        continueViewportFrameDrag(event);
        continueCropDrag(event);
      });

      window.addEventListener("mouseup", () => {
        endViewportFrameDrag();
        endCropDrag();
      });

      billboardViewportFrame.addEventListener("mousedown", (event) => {
        beginViewportFrameDrag(event);
      });

      visualEditorBlock.addEventListener("dragstart", (event) => {
        if (cropDragState) {
          event.preventDefault();
          return;
        }
        const target = event.target;
        if (target instanceof HTMLElement && target.classList.contains("asset-crop-handle")) {
          event.preventDefault();
          return;
        }
        const block = getAssetBlockFromEventTarget(event.target);
        if (!block) {
          event.preventDefault();
          return;
        }
        draggingAssetId = block.dataset.assetId;
        block.classList.add("is-dragging");
        selectSingleAssetBlock(block);
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", draggingAssetId);
        }
      });

      visualEditorBlock.addEventListener("dragover", (event) => {
        if (hasExternalFilePayload(event)) {
          event.preventDefault();
          visualEditorBlock.classList.add("is-drop-target");
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
          }
          return;
        }
        if (!draggingAssetId) {
          return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });

      visualEditorBlock.addEventListener("dragleave", () => {
        visualEditorBlock.classList.remove("is-drop-target");
      });

      visualEditorBlock.addEventListener("dragenter", (event) => {
        if (!draggingAssetId) {
          return;
        }
        const hoveredBlock = getAssetBlockFromEventTarget(event.target);
        if (!hoveredBlock || hoveredBlock.dataset.assetId === draggingAssetId) {
          return;
        }
        const draggingBlock = visualEditorBlock.querySelector('[data-asset-id="' + draggingAssetId + '"]');
        if (!(draggingBlock instanceof HTMLElement)) {
          return;
        }
        const didSwap = swapAssetBlocks(draggingBlock, hoveredBlock);
        if (!didSwap) {
          return;
        }
        syncAssetOrderFromDom();
        saveEditorState();
        syncFlatBillboardArtworks();
        positionScaleControls();
      });

      visualEditorBlock.addEventListener("drop", async (event) => {
        visualEditorBlock.classList.remove("is-drop-target");
        if (hasExternalFilePayload(event)) {
          event.preventDefault();
          await handleGraphicsFilesDrop(event, {});
          return;
        }
        if (!draggingAssetId) {
          return;
        }
        event.preventDefault();
      });

      visualEditorBlock.addEventListener("dragend", () => {
        const draggingBlock = visualEditorBlock.querySelector(".fake-asset-block.is-dragging");
        if (draggingBlock) {
          draggingBlock.classList.remove("is-dragging");
        }
        draggingAssetId = null;
      });

      assetScaleDownButton.addEventListener("click", () => {
        updateSelectedAssetScale(-5);
      });

      assetScaleUpButton.addEventListener("click", () => {
        updateSelectedAssetScale(5);
      });

      assetRotateButton.addEventListener("click", () => {
        rotateSelectedAsset();
      });

      editorStage.addEventListener("scroll", () => {
        syncFlatBillboardViewportOffset();
        positionScaleControls();
      });

      window.addEventListener("resize", () => {
        updateScaleControlsAnchorTop();
        syncBillboardPaddingFromEditorPreview();
        positionScaleControls();
        refreshMarqueeTargetVisibility();
        if (previewMode === "3d") {
          preview3dAutoFitPending = true;
          drawCurvedBillboard3dFrame();
        }
      });

      window.addEventListener("three-ready", () => {
        if (previewMode === "3d") {
          drawCurvedBillboard3dFrame();
        }
      });

      window.addEventListener("keydown", (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          const tagName = target.tagName.toLowerCase();
          const isTypingField = target.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select";
          if (isTypingField) {
            return;
          }
        }
        if (event.key !== "Backspace") {
          return;
        }
        const removedCount = removeSelectedAsset();
        if (removedCount > 0) {
          event.preventDefault();
        }
      });

      window.addEventListener("beforeunload", () => {
        if (marqueeVisibilityObserver) {
          marqueeVisibilityObserver.disconnect();
          marqueeVisibilityObserver = null;
        }
        clearPreview3dDragState();
        stopMarqueeAnimation();
        stopPreview3dLoop();
        if (preview3dThreeState.texture && typeof preview3dThreeState.texture.dispose === "function") {
          preview3dThreeState.texture.dispose();
          preview3dThreeState.texture = null;
        }
        if (preview3dThreeState.mesh) {
          if (preview3dThreeState.mesh.geometry && typeof preview3dThreeState.mesh.geometry.dispose === "function") {
            preview3dThreeState.mesh.geometry.dispose();
          }
          if (preview3dThreeState.mesh.material && typeof preview3dThreeState.mesh.material.dispose === "function") {
            preview3dThreeState.mesh.material.dispose();
          }
          preview3dThreeState.mesh = null;
        }
        if (preview3dThreeState.renderer && typeof preview3dThreeState.renderer.dispose === "function") {
          preview3dThreeState.renderer.dispose();
          preview3dThreeState.renderer = null;
        }
      });

      setupPreview3dCanvasInteraction();
      initMarqueeVisibilityTracking();
      if (!loadSnapshotFromPathIfPresent()) {
        loadBillboardMakerState({ updatePath: false, replaceHistory: true });
      }
      loadAvailableAssets();
    
