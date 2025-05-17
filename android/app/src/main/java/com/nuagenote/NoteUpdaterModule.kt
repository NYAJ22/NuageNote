package com.nuagenote

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.widget.RemoteViews
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

object NoteStorage {
    var note: String = ""
}

class NoteUpdaterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val context: Context = reactContext

    override fun getName(): String {
        return "NoteUpdaterModule"
    }

    @ReactMethod
    fun saveNote(note: String) {
        // Enregistrer la note (en mémoire ou préférences)
        NoteStorage.note = note

        // --- Mettre à jour le widget ---
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, NoteWidgetProvider::class.java)
        val widgetIds = appWidgetManager.getAppWidgetIds(componentName)

        val views = RemoteViews(context.packageName, R.layout.widget_note)
        views.setTextViewText(R.id.noteTextView, "Nouveau contenu")


        for (id in widgetIds) {
            appWidgetManager.updateAppWidget(id, views)
        }
    }
}
