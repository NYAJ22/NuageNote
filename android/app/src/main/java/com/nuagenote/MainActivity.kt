package com.nuagenote

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  companion object {
    private const val REQUEST_CODE_OVERLAY_PERMISSION = 1001
  }

  override fun getMainComponentName(): String = "NuageNote"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Vérifier la permission Overlay ici
    if (!Settings.canDrawOverlays(this)) {
      val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
      startActivityForResult(intent, REQUEST_CODE_OVERLAY_PERMISSION)
    } else {
      startFloatingService()
    }
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE_OVERLAY_PERMISSION) {
      if (Settings.canDrawOverlays(this)) {
        // Permission accordée
        startFloatingService()
      } else {
        // Permission refusée, gérer le cas si nécessaire
      }
    }
  }

  private fun startFloatingService() {
    val intent = Intent(this, FloatingBubbleService::class.java)
    startService(intent)
  }
}
