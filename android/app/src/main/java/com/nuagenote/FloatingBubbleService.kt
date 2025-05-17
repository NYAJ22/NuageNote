package com.nuagenote

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.view.WindowManager
import android.view.LayoutInflater
import android.view.View
import android.view.MotionEvent
import android.graphics.PixelFormat
import android.os.Build
import android.view.Gravity
import kotlin.math.abs


class FloatingBubbleService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var bubbleView: View

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // Inflater la vue de la bulle
        bubbleView = LayoutInflater.from(this).inflate(R.layout.layout_floating_bubble, null)

        // Définir les params de la fenêtre flottante
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )

        // Position initiale
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 0
        params.y = 100

        // Ajouter la vue à la fenêtre
        windowManager.addView(bubbleView, params)

        // Gérer le déplacement de la bulle
        bubbleView.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var initialTouchX = 0f
            private var initialTouchY = 0f

            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when(event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = params.x
                        initialY = params.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        params.x = initialX + (event.rawX - initialTouchX).toInt()
                        params.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager.updateViewLayout(bubbleView, params)
                        return true
                    }
                    MotionEvent.ACTION_UP -> {
                        // Ici, tu peux gérer un clic court (ouvrir l'app)
                        val clickThreshold = 200
                        val deltaX = (event.rawX - initialTouchX).toInt()
                        val deltaY = (event.rawY - initialTouchY).toInt()
                        if (abs(deltaX) < clickThreshold && abs(deltaY) < clickThreshold) {
                            // Clic détecté : ouvrir l'app
                            val intent = Intent(this@FloatingBubbleService, MainActivity::class.java)
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            startActivity(intent)
                            stopSelf() // enlever la bulle
                        }
                        return true
                    }
                }
                return false
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::bubbleView.isInitialized) {
            windowManager.removeView(bubbleView)
        }
    }
}
